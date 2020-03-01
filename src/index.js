const joint = require("jointjs")
const block = require('./block')

class Flowblocks {
    constructor(options) {
        this.options = {}
        Object.assign(this.options, options);
        this._registeredTypes = {}
        this._elements = {};
    }

    registerType(typeName, statusDefinition, templateName){        
        this._registeredTypes[typeName] = {
            name: typeName,
            statusDefinition: statusDefinition,
            template: templateName
        }
        return this._registeredTypes[typeName];
    }

    createElement(typeName, label, position, size){
        var typeDefinition = this._registeredTypes[typeName];
        if(typeDefinition){
            var element = block.createBlankElement(typeDefinition.template, typeDefinition.statusDefinition);
            element.set('name',label);
            if(position){
                element.set('position', position);
            }
            if(size){
                element.set('size', size);
            }
            this._elements[element.id] = element;
            return element;
        }else{
            throw new Error('Undefined type exception:'+typeName+'. Please register type first with registerType().');
        }
    }
}
module.exports = new Flowblocks({});