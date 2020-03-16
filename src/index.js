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
        // this.flow.graph.on('change', function(a,b,c,d,e) {
        //     console.log(a,b,c,d,e);
        // })
        this.flow.paper.on('link:connect', function(linkView, evt, elementViewConnected, magnet, arrowhead) {
            
            var newParticipants = helper.linkGetParticipants(linkView.model, self.flow);
            
            var sourceElement = newParticipants.sourceElement;
            var targetElement = newParticipants.targetElement;

            

            var sourcePort =  newParticipants.sourcePort;
            var targetPort =  newParticipants.targetPort;
            
            
            var previousTargetElement = elementViewConnected.model
            var previousTargetPort = magnet.getAttribute('port');    

            // console.log('CONNECTED ', sourceElement, sourcePort, targetElement, targetPort, previousTargetElement, previousTargetPort);

            sourceElement._handleConnectTo(targetElement, sourcePort, targetPort, linkView.model.id);  
            targetElement._handleConnectFrom(sourceElement, targetPort, sourcePort, linkView.model.id);             
        })

        this.flow.paper.on('link:disconnect', function(link, evt, elementViewDisconnected, magnet, arrowhead) {
            
            var participants = helper.linkGetParticipants(link.model, self.flow);
            
            var sourceElement = participants.sourceElement;
            var targetElement = elementViewDisconnected.model

            var targetPort = magnet.getAttribute('port');
            var sourcePort =  participants.sourcePort;            
            var newTargetElement = participants.targetElement;

            // console.log(sourceElement, targetElement, newTargetElement);

            sourceElement._handleDisconnect(targetElement, sourcePort, link.model.id); 
            targetElement._handleDisconnect(sourceElement, targetPort, link.model.id);            
        })
        this.flow.graph.on('remove', function(cell) {
            
            if(cell.isLink()){
                var participants = helper.linkGetParticipants(cell, self.flow);

                var sourceElement = participants.sourceElement;
                var targetElement = participants.targetElement;

                var sourcePort = participants.sourcePort;
                var targetPort = participants.targetPort;

                sourceElement._handleDisconnect(targetElement, sourcePort, cell.id);
                targetElement._handleDisconnect(sourceElement, targetPort, cell.id);

                // if (participants)
                //     console.log('Removed:', participants.sourceElement, participants.sourcePort, participants.targetElement, participants.targetPort);                    
            }
            
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