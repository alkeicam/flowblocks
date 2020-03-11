const joint = require("jointjs")
const helper = require('./helper')
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
        var self = this;
        this.flow = Flow.create(paperId); 
        this.flow.graph.on('change:source change:target', function(link) {
            if (link.get('source').id && link.get('target').id) {
                //{id: "a89604ba-f176-4616-b37f-547841dd1f9b", port: "in"}
                var source = link.get('source');
                var target = link.get('target');
                
                var sourceElement = self._elements[source.id];
                var targetElement = self._elements[target.id];
                console.log('Connected', sourceElement, source.port, targetElement, target.port);
            }
        })
        this.flow.paper.on('link:disconnect', function(link, evt, elementViewDisconnected, magnet, arrowhead) {
            
            var participants = helper.linkGetParticipants(link.model, self.flow);
            if(participants)
                console.log('Disconnected:', participants.sourceElement, participants.sourcePort, participants.targetElement, participants.targetPort);

            // if (link.get('source').id && link.get('target').id) {
            //     //{id: "a89604ba-f176-4616-b37f-547841dd1f9b", port: "in"}
            //     var source = link.get('source');
            //     var target = link.get('target');
                
            //     var sourceElement = self._elements[source.id];
            //     var targetElement = self._elements[target.id];
            //     console.log('Connected', sourceElement, source.port, targetElement, target.port);
            // }
        })
        this.flow.graph.on('remove', function(cell) {
            
            var participants = helper.linkGetParticipants(cell, self.flow);                        
            if(participants)
                console.log('Removed:', participants.sourceElement, participants.sourcePort, participants.targetElement, participants.targetPort);
            
            
            // if (link.get('source').id && link.get('target').id) {
            //     //{id: "a89604ba-f176-4616-b37f-547841dd1f9b", port: "in"}
            //     var source = link.get('source');
            //     var target = link.get('target');
                
            //     var sourceElement = self._elements[source.id];
            //     var targetElement = self._elements[target.id];
            //     console.log('Connected', sourceElement, source.port, targetElement, target.port);
            // }
        })
    }
    createElement(typeName, label, blockId, position, size, customIconHref){
        var typeDefinition = this._registeredTypes[typeName];
        if(typeDefinition){
            var element = block.createBlankElement(typeDefinition.template, typeDefinition.statusDefinition);            
            element.set('name',label);
            element.set('_type', typeDefinition.name);
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