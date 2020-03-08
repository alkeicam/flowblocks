const joint = require("jointjs")
const block = require('./block')
const Flow = require('./flow')

class Flowblocks {
    constructor(options) {
        this.options = {}
        Object.assign(this.options, options);
        this._registeredTypes = {}
        this._elements = {};
        this.flow = {}
    }

    registerType(typeName, statusDefinition, templateName){        
        this._registeredTypes[typeName] = {
            name: typeName,
            statusDefinition: statusDefinition,
            template: templateName
        }
        return this._registeredTypes[typeName];
    }
    createFlow(paperId){
        this.flow = Flow.create(paperId); 
    }
    createElement(typeName, label, blockId, position, size, customIconHref){
        var typeDefinition = this._registeredTypes[typeName];
        if(typeDefinition){
            var element = block.createBlankElement(typeDefinition.template, typeDefinition.statusDefinition);            
            element.set('name',label);
            if(blockId){
                element.set('blockId', blockId);
                var duplicateElement = Object.entries(this._elements).find(el=>{
                    return el[1].get('blockId') == blockId
                })                
                if(duplicateElement){
                    console.error('Duplicate flow Element for id: '+blockId);
                }
            }            
            if(position){
                element.set('position', position);
            }
            if(size){
                element.set('size', size);
            }
            if(customIconHref){
                if(customIconHref.lastIndexOf('/')==-1){                    
                    element.set('icon', 'https://unpkg.com/flowblocks/dist/resources/img/svg/'+customIconHref+'.svg');
                }else{
                    element.set('icon', customIconHref);
                }
                
            }
            this._elements[element.id] = element;
            this.flow.graph.addCell(element);
            return element;
        }else{
            throw new Error('Undefined type exception:'+typeName+'. Please register type first with registerType().');
        }
    }

    
}
module.exports = new Flowblocks({});