const joint = require("jointjs")
const helper = require('./helper')
const block = require('./block')
const Flow = require('./flow')

class Flowblocks {
    constructor(options) {
        this.options = {}
        Object.assign(this.options, options);
        this._registeredTypes = {}
        this._elements = [];
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
        // this.flow.graph.on('change', function(a,b,c,d,e) {
        //     console.log(a,b,c,d,e);
        // })
        
    }
    getElement(blockId){
        return this._elements.find(element=>{
            return element.get('blockId') == blockId;
        })
    }
    createElement(typeName, label, blockId, position, size, customIconHref, style){
        var typeDefinition = this._registeredTypes[typeName];
        if(typeDefinition){
            var element = block.createBlankElement(typeDefinition.template, typeDefinition.statusDefinition, typeDefinition.style);            
            element.set('name',label);
            element.set('_type', typeDefinition.name);
            if(blockId){
                element.set('blockId', blockId);
                var duplicateElement = this._elements.find(el=>{
                    return el.get('blockId') == blockId
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
            //this._elements[element.id] = element;            
            this._elements.push(element);
            this.flow.graph.addCell(element);
            return element;
        }else{
            throw new Error('Undefined type exception:'+typeName+'. Please register type first with registerType().');
        }
    }
    
    _dumpConnections(){
        this._elements.forEach(element=>{            
            element._dumpConnections();
        })
    }

    
}
module.exports = new Flowblocks({});