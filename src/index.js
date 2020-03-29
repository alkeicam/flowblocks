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

        this.emitter.on(EVENTS_DICT.EVENTS.MENU_IMPORTJSON_LOAD, function(modelSpecificationString){
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
    createFlow(paperId, name, bId){
        var self = this;
        this.flow = Flow.create(paperId, this.emitter, name, bId); 
        console.log('Flowblocks flow up and running')                
        return this.flow;        
    }

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

    getBlock(blockId){
        return this.flow._blocks.find(element=>{
            return element.get('blockId') == blockId;
        })
    }    

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

    export(){
        this.version++;

        this.flow.graph.set('exported', Date.now());
        this.flow.graph.set('version', this.version);
                
        var json = this.flow.graph.toJSON();   
        // also append types definitions
        json.types = this._registeredTypes;
        return json;        
    }

    download(){
        var json = this.export();
        helper.downloadObjectAsJson(json, this.flow.graph.get('name'));
        return json;
    }

    on(eventName, handler){
        if(eventName == 'all'){
            EVENTS_DICT.allEvents().forEach(event=>{
                this.emitter.on(event, handler);                        
            })
        }else{
            this.emitter.on(eventName, handler);
        }
        
    }

    getDefinition(typeName){
        return this._registeredTypes[typeName];
    }

    /**
     * Creates and adds new type to the toolbar using given type name. Type MUST have been registered beforehand.
     * @param {*} typeName Name of the type (type must be already registered)
     * @param {*} label Label to be presented in toolbar for type
     * @param {*} size (Optional) Display dimensions of the type when presenting in toolbar
     */
    createToolbarItem(typeName, label, size){
        var typeDefinition = this._registeredTypes[typeName];
        if(typeDefinition){
            this.emitter.emit(EVENTS_DICT.EVENTS.TOOLBAR_ITEM_CREATE, this._registeredTypes[typeName], label, size);
        } else {
            throw new Error('Undefined type exception:'+typeName+'. Please register type first with registerType().');
        }
        // 
        // if(!this.toolbar){
        //     console.warn('Cant create toolbar item. Create toolbar first by calling createToolbar().')
        //     return;
        // }
        // var typeDefinition = this._registeredTypes[typeName];
        // if(typeDefinition){
        //     var toolbarItem = ToolbarItem.createBlank(typeDefinition.template, typeDefinition.statusDefinition, typeDefinition.style);
        //     toolbarItem.set('name', label);
        //     toolbarItem.set('_type', typeDefinition.name);
        //     if(size){
        //         toolbarItem.set('size', size);
        //     }             
        //     if(typeDefinition.icon){
        //         if(typeDefinition.icon.lastIndexOf('/')==-1){                    
        //             toolbarItem.set('icon', 'https://unpkg.com/flowblocks/dist/resources/img/svg/'+typeDefinition.icon+'.svg');
        //         }else{
        //             toolbarItem.set('icon', typeDefinition.icon);
        //         }                
        //     }   
        //     this.toolbar.addItem(toolbarItem, typeDefinition.category);
        //     return toolbarItem;
        // } else {
        //     throw new Error('Undefined type exception:'+typeName+'. Please register type first with registerType().');
        // }
    }

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