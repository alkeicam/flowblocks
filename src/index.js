const joint = require("jointjs")
const helper = require('./helper')
const block = require('./block')
const Flow = require('./flow')
const Toolbar = require('./toolbar')
const ToolbarItem = require('./toolbar-item')
const EVENTS_DICT = require('./events-dict')
const EventEmitter = require('events')
const Interactive = require('./ui/interactive')


class Flowblocks {
    constructor(options) {
        this.options = {}
        Object.assign(this.options, options);
        this._registeredTypes = {}        
        this.flow = undefined
        this.toolbar = undefined
        this.emitter = new EventEmitter();
        this._initialize();
    }
    _initialize(){  
        var self = this;        
    }

    registerType(typeName, statusDefinition, templateName, icon, defaultStyle){        
        this._registeredTypes[typeName] = {
            name: typeName,
            statusDefinition: statusDefinition,
            template: templateName,
            style: defaultStyle,
            icon: icon
        }
        // TODO add to toolbar
        this.createToolbarItem(typeName, typeName)

        return this._registeredTypes[typeName];
    }
    createFlow(paperId){
        var self = this;
        this.flow = Flow.create(paperId, this.emitter); 
        console.log('Flowblocks flow up and running')                
        return this.flow;        
    }

    createToolbar(divId){
        var self = this;
        this.toolbar = Toolbar.create(divId, this.emitter); 
        console.log('Flowblocks toolbar up and running')
        return this.toolbar;        
    }

    createApp(flowClass, toolbarClass){
        Interactive.create(this, this.emitter, flowClass, toolbarClass);
        console.log('Flowblocks app up and running')
    }

    getBlock(blockId){
        return this.flow._blocks.find(element=>{
            return element.get('blockId') == blockId;
        })
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
    
    createToolbarItem(typeName, label, size){
        if(!this.toolbar){
            console.error('Cant create toolbar item. Create toolbar first by calling createToolbar().')
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
            this.toolbar.addItem(toolbarItem);
            return toolbarItem;
        } else {
            throw new Error('Undefined type exception:'+typeName+'. Please register type first with registerType().');
        }
    }

    createBlock(typeName, label, blockId, position, size){
        var typeDefinition = this._registeredTypes[typeName];
        if(typeDefinition){
            var newBlock = block.createBlank(blockId, typeDefinition.template, typeDefinition.statusDefinition, typeDefinition.style);            
            newBlock.set('name',label);
            newBlock.set('_type', typeDefinition.name);
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