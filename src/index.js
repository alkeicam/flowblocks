const joint = require("jointjs")
const helper = require('./helper')
const block = require('./block')
const Flow = require('./flow')
// const Toolbar = require('./ui/flowblocks-ui-toolbar');
const Toolbar = require('flowblocks-ui-toolbar');

// const Toolbar = require('./toolbar')
// const ToolbarItem = require('./toolbar-item')
const EVENTS_DICT = require('./events-dict')
const EventEmitter = require('events')
const Interactive = require('./ui/interactive')
const Api = require('./api')


class Flowblocks {
    constructor(options) {
        this.options = {}
        Object.assign(this.options, options);
        this._registeredTypes = {}        
        this.flow = undefined
        this.toolbar = undefined
        this.emitter = new EventEmitter();
        this.version = 1;
        this._initialize();
    }
    _initialize(){  
        var self = this;     
        // initialize events

        this.emitter.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_IMPORT_JSON, function(modelSpecificationString){
            self.import(modelSpecificationString);
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
        this.emitter.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_SAVE, function(){
            var dataJson = self.export();
            Api.save('flowblock',dataJson.id, dataJson, dataJson.version);
            self.emitter.emit(EVENTS_DICT.EVENTS.FLOWBLOCKS_DONE_SUCCESS);
        })

        // download flowblocks
        this.emitter.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_DOWNLOAD, function(){
            self.download();            
            self.emitter.emit(EVENTS_DICT.EVENTS.FLOWBLOCKS_DONE_SUCCESS);
        })

        // create new type
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
        var validations = this._prepareTypeValidation(validationFunction, validationFunctionSrc);
        this._registeredTypes[typeName] = {
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
        return this._registeredTypes[typeName];
    }
    /**
     * Creates flowblocks main element - Flow. When flow is ready one can define new Block types via registerType() and create new instances of Blocks via 
     * @param {*} paperId 
     * @param {*} name 
     * @param {*} bId 
     */
    createFlow(paperId, name, bId){
        var self = this;
        this.flow = Flow.create(paperId, this.emitter, name, bId); 
        console.log('Flowblocks flow up and running')                
        return this.flow;        
    }
    /**
     * Creates Flowblocks supplementary element - Toolbar which can be bound to view in order to create new Blocks on the diagram from Toolbar.
     */
    createToolbar(){
        var self = this;
        this.toolbar = Toolbar.create(this.emitter);         
        // using this.toolbar is deprecated, instead EVENTS shall be used
        return this.toolbar;        
    }

    createApp(flowClass, toolbarClass, menuClass, menuContents){
        Interactive.create(this, this.emitter, flowClass, toolbarClass, menuClass, menuContents);
        console.log('Flowblocks app up and running')
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
     * @param {*} modelSpecification JSON representation of Flowblocks (usually generated earlier by using export())
     */
    import(modelSpecification) {
        //JSONIFY
        var specificationObject = JSON.parse(modelSpecification);
        this.flow.import(specificationObject);
        var typesArray = []
        Object.entries(specificationObject.types).forEach(entry => {
            let key = entry[0];
            let value = entry[1];
            typesArray.push(value);
        });
        this.registerTypes(typesArray);
        // now notify toolbar that it should be reinitialized
        this.rebuildToolbar(typesArray);        
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
        this.version++;

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
     * @param {*} label Label visible on the Flowblocks diagram
     * @param {*} blockId Business id of the block
     * @param {*} position (optional) Starting position of Block
     * @param {*} size (optional) Size of the Block
     */
    createBlock(typeName, label, blockId, position, size){
        var typeDefinition = this._registeredTypes[typeName];
        if(typeDefinition){
            var newBlock = block.createBlank(blockId, typeDefinition.name, typeDefinition.template, typeDefinition.statusDefinition, typeDefinition.style, typeDefinition.validation);            
            newBlock.set('name',label);            
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
                    newBlock.set('icon', 'https://unpkg.com/flowblocks/dist/resources/img/svg/'+typeDefinition.icon+'.svg');
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
}
module.exports = new Flowblocks({});