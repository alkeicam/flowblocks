const joint = require("jointjs")
const helper = require('./helper')
const block = require('./block')
const Flow = require('./flow')
const EVENTS_DICT = require('./events-dict')
const EventEmitter = require('events')

const Api = require('./api')


class Flowblocks {
    constructor(options) {
        this.options = {}
        Object.assign(this.options, options);
        this._registeredTypes = {}        
        this._sections = undefined
        this._readOnly = false
        this._testIdPrefix = 'flowblocks'
        this.flow = undefined        
        this.emitter = new EventEmitter();
        this.version = 0;
        this._initialize();
    }
    /**
     * Creates new, clean Flowblocks instance
     */
    create(){
        return new Flowblocks({});
    }

    _initialize(){  
        var self = this;     
        // initialize events

        this.emitter.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_IMPORT_JSON, function(modelSpecificationString, forceSpecification){
            // import from UI is disabled in read only mode (programmatic import() is still available)
            if(self._readOnly) return;
            self.import(modelSpecificationString, true, forceSpecification);
        })

        this.emitter.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_IMPORT_JSON_SKIP_TYPES, function(modelSpecificationString, forceSpecification){
            if(self._readOnly) return;
            self.import(modelSpecificationString, false, forceSpecification);
        })
        

        // add new block
        this.emitter.on(EVENTS_DICT.EVENTS.BLOCK_CREATE, function(blockId, blockType, label, position, event){            
            // no UI driven modifications in read only mode
            if(self._readOnly) return;
            self.createBlock(blockType, label, blockId, position);
        }) 

        // save block details
        this.emitter.on(EVENTS_DICT.EVENTS.BLOCK_DETAILS_SAVE, function(blockId, configurables, event){
            // no UI driven modifications in read only mode
            if(self._readOnly) return;
            var block = self.getBlock(blockId); 
            block.setConfigurables(configurables);           
            // block.set('configurables', configurables);
        })   

        // save flowblocks
        this.emitter.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_SAVE, function(datatype){
            // raise version
            self.raise();
            var dataJson = self.export();
            self.save(dataJson, datatype);
        })

        // download flowblocks
        this.emitter.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_DOWNLOAD, function(){
            self.download();            
            self.emitter.emit(EVENTS_DICT.EVENTS.FLOWBLOCKS_DONE_SUCCESS);
        })

        // create new type
    }
    /**
     * Returns flow imprint / base information
     * @returns Object {n: name, i: business id, v: version, c: created timestamp}
     */
    getBaseInformation(){
        return {
            n: this.flow.graph.get('name'),
            i: this.flow.graph.get('id'),
            v: this.flow.graph.get('version'),
            c: this.flow.graph.get('created')
        }
    }
    /**
     * Updates version number on Flowblocks model
     */
    raise(){
        this.flow.graph.set('version', ++this.version);
    }
    /**
     * Saves model to storage
     * @param {*} modelSpecification Json data describing model (usually got from export() method)
     */
    save(modelSpecification, datatype){
        // save
        Api.save(datatype?datatype:'flowblock',modelSpecification.id, modelSpecification, modelSpecification.version);
        this.emitter.emit(EVENTS_DICT.EVENTS.FLOWBLOCKS_DONE_SUCCESS);
        this.emitter.emit(EVENTS_DICT.EVENTS.FLOWBLOCKS_SAVE_SUCCESS, datatype, modelSpecification.id, modelSpecification.version, modelSpecification);
    }
    /**
     * Registers available Flowblocks types that can be created 
     * and managed by the Flowblocks.
     * @param {*} typesArray 
     */
    registerTypes(typesArray){
        typesArray.forEach(theType=>{
            this.registerType(theType.name, theType.template, theType.icon, theType.style, theType.configurables, theType.category, theType.validationFunction, theType.validationSrc, theType.rules, theType.section);
        })
    }

    /**
     * Helper method that calculates validation function source and object
     * so it can be bound to blocks that are being created.
     * It is required as when flowblocks are imported function objects are not persisted.
     * Instead function source code is persisted so one must instantiate functions from 
     * source code when importing.
     * @param {*} validationFunction 
     * @param {*} validationFunctionSrc 
     */
    _prepareTypeValidation(validationFunction, validationFunctionSrc){
        if(!validationFunction && !validationFunctionSrc)
            return {
                f: undefined,
                s: undefined
            }
        var codeSource;
        var functionSource;

        var codeFunction;
        var functionFunction;

        if(validationFunction){
            codeFunction = validationFunction.toString();
            functionFunction = validationFunction;
        }
        if(validationFunctionSrc){
            codeSource = validationFunctionSrc;
            functionSource = new Function("return " + validationFunctionSrc)();
        }

        return {
            f: functionFunction ? functionFunction : functionSource,
            s: codeSource ? codeSource : codeFunction
        }
    }

    _parseType(typeName, templateName, icon, defaultStyle, typeConfigurableArray, typeCategory, validationFunction, validationFunctionSrc, rules, section){
        // handle validation functions preprocessing
        // declarative rules are used only when no validation function is provided (no new Function for such types)
        var validations = (rules && !validationFunction && !validationFunctionSrc) ? { f: undefined, s: undefined } : this._prepareTypeValidation(validationFunction, validationFunctionSrc);
        const type = {
            name: typeName,
            // statusDefinition: statusDefinition,
            template: templateName,
            style: defaultStyle,
            icon: icon,
            configurables: typeConfigurableArray,
            category: typeCategory,
            validation: validations.f,
            validationSrc: validations.s
        }
        if(rules)
            type.rules = rules;
        if(section)
            type.section = section;
        return type
    }

    _parseTypes(typeFromSpecification){
        const types = {};
        typeFromSpecification.forEach(type=>{
            // types stored in specification (export) use type definition field names (name, template, ...)
            var typeName = type.typeName || type.name;
            types[typeName] = this._parseType(typeName, type.templateName || type.template, type.icon, type.defaultStyle || type.style, type.typeConfigurableArray || type.configurables, type.typeCategory || type.category, type.validationFunction, type.validationFunctionSrc || type.validationSrc, type.rules, type.section);            
        })        
        return types
    }

    /**
     * Registers new type definition in Flowblocks so one can create new Blocks with given type
     * @param {*} typeName Name of the type (used when creating Blocks)
     * @param {*} templateName Template on which new type is constructed
     * @param {*} icon Icon used to represent the type and blocks of this type on the diagram
     * @param {*} defaultStyle 
     * @param {*} typeConfigurableArray (Optional) When type has some user configurable parameters this is a parameters' specification
     * @param {*} typeCategory Category of the type, used in groupping on the Toolbar
     * @param {*} validationFunction Javascript function that will be used in order to update/verify block status after modifications
     * @param {*} validationFunctionSrc Source code of the validation function, used when persisting/exporting/importing blocks
     * @param {*} rules (Optional) Declarative validation rules used when no validation function is provided:
     *      {successors: {out1: {types: [type names], min, max}}, required: [field ids], patterns: {fieldId: {re, msg}}}
     * @param {*} section (Optional) Toolbar section id (see rebuildToolbar), when not provided typeCategory is used
     */
    registerType(typeName, templateName, icon, defaultStyle, typeConfigurableArray, typeCategory, validationFunction, validationFunctionSrc, rules, section){
        // handle validation functions preprocessing
        // var validations = this._prepareTypeValidation(validationFunction, validationFunctionSrc);
        this._registeredTypes[typeName] = this._parseType(typeName, templateName, icon, defaultStyle, typeConfigurableArray, typeCategory, validationFunction, validationFunctionSrc, rules, section);
        // {
        //     name: typeName,
        //     // statusDefinition: statusDefinition,
        //     template: templateName,
        //     style: defaultStyle,
        //     icon: icon,
        //     configurables: typeConfigurableArray,
        //     category: typeCategory,
        //     validation: validations.f,
        //     validationSrc: validations.s
        // }        
        return this._registeredTypes[typeName];
    }
    /**
     * Creates flowblocks main element - Flow. When flow is ready one can define new Block types via registerType() and create new instances of Blocks via 
     * @param {*} paperId 
     * @param {*} name User friendly name of the flowblocks flow
     * @param {*} bId User friendly business id of the flowblocks flow
     */
    createFlow(paperId, name, bId){
        var self = this;
        if(Flow.setTestIdPrefix)
            Flow.setTestIdPrefix(this._testIdPrefix);
        this.flow = Flow.create(paperId, this.emitter, name, bId); 
        // previous read only state is applied to the new flow
        if(this._readOnly && this.flow.setReadOnly)
            this.flow.setReadOnly(true);
        self.raise();
        console.log('Flowblocks up and running')                
        return this.flow;        
    }


    /**
     * Loads provided specification into temporary graph, identifies Start element and makes
     * a BFS graph traversal from the Start element.
     * @param {*} modelSpecification Target Flowblocks model specification
     * @returns {Array} Array of {p: previous, c: current, n: next} objects holding blocks  - starting from the Start type of block
     */
    traverseModelSpecificationSequential(modelSpecification){
        var tempGraph = new joint.dia.Graph();
        tempGraph.fromJSON(modelSpecification);


        var result = []; // {p: previous, c: current, n: next}
        // find start block
        var inputBlock = undefined;
        inputBlock = tempGraph.getCells().find(block=>{
            return block.get('_template') == 'Start';
        })

        if(!inputBlock){            
            console.warn('No input block found.');
            return;
        }

        // traverse graph
        var blocks = []; 

        tempGraph.bfs(inputBlock, function(block){
            blocks.push(block)
        })

        // build result object
        for(var i=0; i<blocks.length;i++){
            var pIdx = i-1>=0?i-1:i;
            var nIdx = i+1<blocks.length?i+1:i;
            
            var previous = blocks[pIdx];
            var current = blocks[i];   
            var next = blocks[nIdx];
            result.push({
                p: previous.get('blockId') != current.get('blockId')?previous:undefined,
                c: current,
                n: next.get('blockId') != current.get('blockId')?next:undefined
            })
        }
        return result;

    }

    /**
     * Returns Block with given id
     * @param {*} blockId Id of the Block which to load
     */
    getBlock(blockId){
        return this.flow._blocks.find(element=>{
            return element.get('blockId') == blockId;
        })
    }    

    /**
     * Resets Flowblocks and imports Flowblocks data from file.
     * @param {*} modelSpecification String representation of Flowblocks (usually generated earlier by using export()) data as exported via export().stringify()
     * @param {*} loadTypes Boolean when false then types will not be imported, only model specification will be imported. When true both are imported.
     * @param {*} forceSpecification.specificationId String When provided specification id from modelSpecification will be overwritten with given value
     * @param {*} forceSpecification.versionId String When provided version id from modelSpecification will be overwritten with given value
     * @param {*} forceSpecification.name String When provided name from modelSpecification will be overwritten with given value
     */
    import(modelSpecification, loadTypes = true, forceSpecification, load) {
        //JSONIFY
        var specificationObject = JSON.parse(modelSpecification);
        // handle force overwrite
        if(forceSpecification && forceSpecification.specificationId)
            specificationObject.id = forceSpecification.specificationId
        if(forceSpecification && forceSpecification.versionId)
            specificationObject.version = forceSpecification.versionId    
        if(forceSpecification && forceSpecification.name)
            specificationObject.name = forceSpecification.name        

        var typesArrayFromImportedSpecs = []
        if(loadTypes){
            Object.entries(specificationObject.types).forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                typesArrayFromImportedSpecs.push(value);
            });
        }
        

        // perform import of specification, when type load is requested cell validations will be loaded from imported specification
        // otherwise provided that somebody registered types already already registered types validation will be used OR
        // validation from cell attributes will be used
        this.flow.import(specificationObject, loadTypes?this._parseTypes(typesArrayFromImportedSpecs):this._registeredTypes);
        // make sure that flowblocks version holder is aligned with imported
        this.version = specificationObject.version;
        // types will be rebuilt/imported when requested
        if(loadTypes){            
            this.registerTypes(typesArrayFromImportedSpecs);
            // now notify toolbar that it should be reinitialized (previously provided sections are kept)
            this.rebuildToolbar(typesArrayFromImportedSpecs, this._sections);        
        }        
    }

    /**
     * Resets and rebuilds Toolbar contents
     * @param {*} typesArray 
     * @param {*} sections (Optional) Toolbar sections [{id, label, order, icon, collapsed}]. Type is presented in the section
     * which id equals type.section (or type.category when no section given). When omitted toolbar is groupped by type.category.
     */
    rebuildToolbar(typesArray, sections){
        if(sections !== undefined)
            this._sections = sections;
        if(sections)
            this.emitter.emit(EVENTS_DICT.EVENTS.TOOLBAR_RESET, typesArray, sections);        
        else
            this.emitter.emit(EVENTS_DICT.EVENTS.TOOLBAR_RESET, typesArray);        
    }

    /**
     * @returns toolbar sections provided with rebuildToolbar() (or undefined)
     */
    getSections(){
        return this._sections;
    }

    /**
     * Generates new JSON Snapshot of Flowblocks data (Flows, blocks, types).
     * @returns JSON representation of the Flowblocks data (Flows, blocks, types)
     */
    export(){        
        this.flow.graph.set('exported', Date.now());
        this.flow.graph.set('version', this.version);
                
        var json = this.flow.graph.toJSON();   
        // ghost cells (diff overlay) are not part of the diagram
        json.cells = (json.cells || []).filter(cell=>!cell.ghost);
        // also append types definitions
        json.types = this._registeredTypes;
        return json;        
    }

    /**
     * Returns deep copy of the diagram (graph JSON) without side effects of export() (no version/exported change).
     * Ghost cells (diff overlay) are excluded.
     * @param {*} options.strip (Optional) Array of cell attribute names removed from each cell, i.e. ['attrs','_style','_validationSource']
     * @param {*} options.types (Optional) When true registered types definitions are attached (as in export())
     * @returns Object {cells: [], name, id, version, created, ...}
     */
    getDiagram(options){
        var opts = options || {};
        var json = JSON.parse(JSON.stringify(this.flow.graph.toJSON()));
        json.cells = (json.cells || []).filter(cell=>!cell.ghost);
        if(Array.isArray(opts.strip) && opts.strip.length > 0){
            json.cells.forEach(cell=>{
                opts.strip.forEach(key=>{
                    delete cell[key];
                })
            })
        }
        if(opts.types){
            json.types = JSON.parse(JSON.stringify(this._registeredTypes));
        }
        return json;
    }

    /**
     * @returns true when diagram was modified since creation, import or last markClean() (FB-01)
     */
    isDirty(){
        return this.flow && this.flow.isDirty ? this.flow.isDirty() : false;
    }

    /**
     * Marks diagram as clean, i.e. after successful save (FB-01)
     */
    markClean(){
        if(this.flow && this.flow.markClean)
            this.flow.markClean();
    }

    /**
     * Turns read only mode on/off (FB-04). In read only mode diagram can not be modified from UI
     * (no moving, linking, removing, creating blocks, saving block details, importing from menu).
     * Emits flowblocks:readonly-changed so toolbar and designer can follow.
     * @param {*} readOnly 
     */
    setReadOnly(readOnly){
        this._readOnly = readOnly ? true : false;
        if(this.flow && this.flow.setReadOnly)
            this.flow.setReadOnly(this._readOnly);
        this.emitter.emit(EVENTS_DICT.EVENTS.READONLY_CHANGED, this._readOnly);
        return this._readOnly;
    }

    isReadOnly(){
        return this._readOnly;
    }

    /**
     * Sets prefix of data-testid attributes generated by flowblocks (default 'flowblocks'), i.e. 'rule-editor'
     * gives data-testid="rule-editor.block" (FB-05)
     * @param {*} prefix 
     */
    setTestIdPrefix(prefix){
        this._testIdPrefix = prefix || 'flowblocks';
        if(this.flow && this.flow.setTestIdPrefix)
            this.flow.setTestIdPrefix(this._testIdPrefix);
    }

    getTestIdPrefix(){
        return this._testIdPrefix;
    }

    /**
     * Highlights blocks and links (FB-07), see Flow.highlight
     * @param {*} spec {blocks: [{id, state}], links: [{id, state}]}
     * @param {*} options {replace: true} clears previous highlights first
     */
    highlight(spec, options){
        if(this.flow && this.flow.highlight)
            this.flow.highlight(spec, options);
    }

    /**
     * Removes all (or given) highlights (FB-07)
     * @param {*} ids (Optional) array of block ids / cell ids
     */
    clearHighlights(ids){
        if(this.flow && this.flow.clearHighlights)
            this.flow.clearHighlights(ids);
    }

    /**
     * Sets or removes block marker (FB-08)
     * @param {*} blockId 
     * @param {*} kind 'breakpoint'|'breakpoint-cond'|'breakpoint-disabled'|null
     * @param {*} tooltip (Optional)
     */
    setMarker(blockId, kind, tooltip){
        if(this.flow && this.flow.setMarker)
            this.flow.setMarker(blockId, kind, tooltip);
    }

    getMarkers(){
        return this.flow && this.flow.getMarkers ? this.flow.getMarkers() : {};
    }

    clearMarkers(){
        if(this.flow && this.flow.clearMarkers)
            this.flow.clearMarkers();
    }

    /**
     * Presents diff overlay on current diagram (FB-10)
     * @param {*} diff {added: [blockId], changed: [blockId], removed: [serialized cell]}
     */
    showDiff(diff){
        if(this.flow && this.flow.showDiff)
            this.flow.showDiff(diff);
    }

    clearDiff(){
        if(this.flow && this.flow.clearDiff)
            this.flow.clearDiff();
    }

    /**
     * Exports Flowblocks data and triggers its download when launched in browser.
     */
    download(){
        var json = this.export();
        helper.downloadObjectAsJson(json, this.flow.graph.get('name'));
        return json;
    }

    /**
     * Send notification to Flowblocks
     * @param {*} eventName Name of the event
     * @param {*} args eventuall arguments of the event
     */
    notify(eventName, ...args){
        this.emitter.emit(eventName, ...args);
    }
    /**
     * Adds event handler to Flowblocks
     * @param {*} eventName 
     * @param {*} handler 
     */
    on(eventName, handler){
        if(eventName == 'all'){
            EVENTS_DICT.allEvents().forEach(event=>{
                this.emitter.on(event, handler);                        
            })
        }else{
            this.emitter.on(eventName, handler);
        }        
    }
    /**
     * Returns type definition registered with given name
     * @param {*} typeName Name of the type
     */
    getDefinition(typeName){
        return this._registeredTypes[typeName];
    }


    /**
     * Creates new Flowblocks block on the diagram using provided type.
     * @param {*} typeName Name of the registered type that will be used for the Block (see registerType)
     * @param {*} label Label visible on the Flowblocks diagram, also copied to "name" configurable
     * @param {*} blockId Business id of the block
     * @param {*} position (optional) Starting position of Block
     * @param {*} size (optional) Size of the Block
     */
    createBlock(typeName, label, blockId, position, size){
        var typeDefinition = this._registeredTypes[typeName];
        if(typeDefinition){
            var newBlock = block.createBlank(blockId, typeDefinition.name, typeDefinition.template, typeDefinition.statusDefinition, typeDefinition.style, typeDefinition.validation, typeDefinition.configurables, typeDefinition.rules);            
            // newBlock.set('name',label);       
            newBlock.setConfigurable("name", label);     
            if(blockId){                
                var duplicateElement = this.flow._blocks.find(el=>{
                    return el.get('blockId') == blockId
                })                
                if(duplicateElement){
                    console.error('Duplicate flow Block for id: '+blockId);
                }
            }            
            if(position){
                newBlock.set('position', position);
            }
            if(size){
                newBlock.set('size', size);
            }            
            if(typeDefinition.icon){
                if(typeDefinition.icon.lastIndexOf('/')==-1){                    
                    newBlock.set('icon', 'https://cdn.jsdelivr.net/npm/flowblocks-icons@1.0.8/i/'+typeDefinition.icon+'.svg');
                }else{
                    newBlock.set('icon', typeDefinition.icon);
                }                
            }     
            
            this.flow.addBlock(newBlock);
            return newBlock;
        }else{
            throw new Error('Undefined type exception:'+typeName+'. Please register type first with registerType().');
        }
    }
    
    _dumpConnections(){
        this.flow._blocks.forEach(element=>{            
            element._dumpConnections();
        })
    }
    /**
     * Adds pan and zoom functionality to flow diagram
     * @param {*} panAndZoom svg-pan-zoom object that will be used to controll panning and zooming
     */
    enablePanAndZoom(panAndZoom){
        // must have svg-pan-zoom library loaded on page
        if(!panAndZoom) return;
        try{
            this.flow.enablePanAndZoom(panAndZoom);
        }catch(error){
            console.error(error);
        }
    }
    /**
     * Validates Flowblocks flow and data
     * 
     * @returns Object containing status and eventuall list of errors of this Flowblocks instance. {valid: true|false, errorBlocks: [{ blockId: , errors: [{code: , cId:, msg:}]}]}
     */
    /**
     * Recalculates status of every block of a registered type and validates the flow (FB-13) - use before save: status
     * stored in an imported diagram (created by API, saved with other validation rules) may be outdated.
     * @returns see validate()
     */
    revalidate(){
        if(this.flow)
            return this.flow.revalidate(this._registeredTypes);
        return this.validate();
    }

    validate(){
        if(this.flow)
            return this.flow.validate();
        return {
            valid: false,
            errorBlocks: [{
                blockId: undefined,
                errors: [{ code: 'GENERAL', cId: 'flowblocks', msg: 'No flow configured' }]
            }],
        };
    }
}
module.exports = new Flowblocks({});