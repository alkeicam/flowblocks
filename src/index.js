const joint = require("jointjs")
const helper = require('./helper')
const block = require('./block')
const Flow = require('./flow')

class Flowblocks {
    constructor(options) {
        this.options = {}
        Object.assign(this.options, options);
        this._registeredTypes = {}        
        this.flow = {}
    }

    registerType(typeName, statusDefinition, templateName, defaultStyle){        
        this._registeredTypes[typeName] = {
            name: typeName,
            statusDefinition: statusDefinition,
            template: templateName,
            style: defaultStyle
        }
        return this._registeredTypes[typeName];
    }
    createFlow(paperId){
        var self = this;
        this.flow = Flow.create(paperId); 
        return this.flow;        
    }
    getBlock(blockId){
        return this.flow._blocks.find(element=>{
            return element.get('blockId') == blockId;
        })
    }

    createBlock(typeName, label, blockId, position, size, customIconHref, style){
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
            if(customIconHref){
                if(customIconHref.lastIndexOf('/')==-1){                    
                    newBlock.set('icon', 'https://unpkg.com/flowblocks/dist/resources/img/svg/'+customIconHref+'.svg');
                }else{
                    newBlock.set('icon', customIconHref);
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