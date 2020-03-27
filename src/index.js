const joint = require("jointjs")
const helper = require('./helper')
const block = require('./block')
const Flow = require('./flow')
const Toolbar = require('./toolbar')
const ToolbarItem = require('./toolbar-item')
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

    registerTypes(typesArray){
        typesArray.forEach(theType=>{
            this.registerType(theType.name, theType.template, theType.icon, theType.style, theType.configurables, theType.category, theType.validationFunction, theType.validationSrc);
        })
    }

    registerType(typeName, templateName, icon, defaultStyle, typeConfigurableArray, typeCategory, validationFunction, validationFunctionSrc){
        console.log('Validation function: ',typeName,  validationFunction, validationFunctionSrc)      ;
        // check if  validationFunction is an actual function or a string representation
        // if this is a string representation than create function on the fly from the source
        var vFunction = validationFunction instanceof Function ? validationFunction : new Function("return " + validationFunctionSrc)();
        console.log('Function: ',typeName,  vFunction);
        // if validationFunction is an actual function we retrieve its source code and store
        var vFunctionSrc = validationFunctionSrc;        
        console.log('FunctionSrc: ',typeName, vFunctionSrc);

        this._registeredTypes[typeName] = {
            name: typeName,
            // statusDefinition: statusDefinition,
            template: templateName,
            style: defaultStyle,
            icon: icon,
            configurables: typeConfigurableArray,
            category: typeCategory,
            validation: vFunction,
            validationSrc: vFunctionSrc
        }        
        // add to toolbar
        this.createToolbarItem(typeName, typeName)

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
        console.log('Flowblocks toolbar up and running.')
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
        if(this.toolbar){
            this.toolbar.removeAllItems();
        }
        // ew poiterowac i zbudowac tablice blocks
        // sprawdzic - set graph version
        // add types
        var typesArray = []
        Object.entries(specificationObject.types).forEach(entry => {
            let key = entry[0];
            let value = entry[1];
            typesArray.push(value);
        });
        this.registerTypes(typesArray);

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
    
    createToolbarItem(typeName, label, size){
        if(!this.toolbar){
            console.warn('Cant create toolbar item. Create toolbar first by calling createToolbar().')
            return;
        }
        var typeDefinition = this._registeredTypes[typeName];
        if(typeDefinition){
            var toolbarItem = ToolbarItem.createBlank(typeDefinition.template, typeDefinition.statusDefinition, typeDefinition.style);
            toolbarItem.set('name', label);
            toolbarItem.set('_type', typeDefinition.name);
            if(size){
                toolbarItem.set('size', size);
            }             
            if(typeDefinition.icon){
                if(typeDefinition.icon.lastIndexOf('/')==-1){                    
                    toolbarItem.set('icon', 'https://unpkg.com/flowblocks/dist/resources/img/svg/'+typeDefinition.icon+'.svg');
                }else{
                    toolbarItem.set('icon', typeDefinition.icon);
                }                
            }   
            this.toolbar.addItem(toolbarItem, typeDefinition.category);
            return toolbarItem;
        } else {
            throw new Error('Undefined type exception:'+typeName+'. Please register type first with registerType().');
        }
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