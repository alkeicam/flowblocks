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
            self.import(modelSpecificationString, true, forceSpecification);
        })

        this.emitter.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_IMPORT_JSON_SKIP_TYPES, function(modelSpecificationString, forceSpecification){
            self.import(modelSpecificationString, false, forceSpecification);
        })
        

        // add new block
        this.emitter.on(EVENTS_DICT.EVENTS.BLOCK_CREATE, function(blockId, blockType, label, position, event){            
            self.createBlock(blockType, label, blockId, position);
        }) 

        // save block details
        this.emitter.on(EVENTS_DICT.EVENTS.BLOCK_DETAILS_SAVE, function(blockId, configurables, event){
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
            this.registerType(theType.name, theType.template, theType.icon, theType.style, theType.configurables, theType.category, theType.validationFunction, theType.validationSrc);
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

    _parseType(typeName, templateName, icon, defaultStyle, typeConfigurableArray, typeCategory, validationFunction, validationFunctionSrc){
        // handle validation functions preprocessing
        var validations = this._prepareTypeValidation(validationFunction, validationFunctionSrc);
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
        return type
    }

    _parseTypes(typeFromSpecification){
        const types = {};
        typeFromSpecification.forEach(type=>{
            types[type.typeName] = this._parseType(type.typeName, type.templateName, type.icon, type.defaultStyle, type.typeConfigurableArray, type.typeCategory, type.validationFunction, type.validationFunctionSrc);            
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
     */
    registerType(typeName, templateName, icon, defaultStyle, typeConfigurableArray, typeCategory, validationFunction, validationFunctionSrc){
        // handle validation functions preprocessing
        // var validations = this._prepareTypeValidation(validationFunction, validationFunctionSrc);
        this._registeredTypes[typeName] = this._parseType(typeName, templateName, icon, defaultStyle, typeConfigurableArray, typeCategory, validationFunction, validationFunctionSrc);
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
        this.flow = Flow.create(paperId, this.emitter, name, bId); 
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
            // now notify toolbar that it should be reinitialized
            this.rebuildToolbar(typesArrayFromImportedSpecs);        
        }        
    }

    /**
     * Resets and rebuilds Toolbar contents
     * @param {*} typesArray 
     */
    rebuildToolbar(typesArray){
        this.emitter.emit(EVENTS_DICT.EVENTS.TOOLBAR_RESET, typesArray);        
    }

    /**
     * Generates new JSON Snapshot of Flowblocks data (Flows, blocks, types).
     * @returns JSON representation of the Flowblocks data (Flows, blocks, types)
     */
    export(){        
        this.flow.graph.set('exported', Date.now());
        this.flow.graph.set('version', this.version);
                
        var json = this.flow.graph.toJSON();   
        // also append types definitions
        json.types = this._registeredTypes;
        return json;        
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
            var newBlock = block.createBlank(blockId, typeDefinition.name, typeDefinition.template, typeDefinition.statusDefinition, typeDefinition.style, typeDefinition.validation, typeDefinition.configurables);            
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