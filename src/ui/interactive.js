const helper = require('../helper')
const EVENTS_DICT = require('../events-dict')
const shortid = require('shortid');

class Interactive {
    constructor(options) {
        this.emmiter = undefined;
        this.flowClass = undefined;
        this.toolbarClass = undefined
        this.flowblocks = undefined
        this.flowController = {}        
        this.toolbarController = undefined        
    }

    create(flowblocks, emmiter, flowClass, toolbarClass){
        this.emmiter = emmiter;
        this.flowClass = flowClass;
        this.toolbarClass = toolbarClass;  
        this.flowblocks = flowblocks;
        this._flowController();  
        this._toolbarController();      
        this._rivetize();
        this._bindFlowEvents(flowblocks);
        this._bindToolbarEvents(flowblocks);
    }

    _flowController(){
        var self = this;
        this.flowController = {
            parent: self,
            model: {
                details: {
                    show: false,                    
                    type: undefined,
                    label: undefined,
                    blockId: undefined,
                    configurables: []
                }
            },
            dismiss: function(e, that){
                that.model.details.show = false;
                that.resetDetails();
            },
            detailsSave: function(e, that){                                
                var block = self.flowController.model.details.block;
                
                var configurables = [];
                that.model.details.configurables.forEach(item=>{
                    configurables.push({
                        i: item.id,
                        v: item.value
                    })                    
                })                

                that.parent.emmiter.emit(EVENTS_DICT.EVENTS.BLOCK_DETAILS_SAVE, block.get('blockId'), configurables, e);
                that.resetDetails();
            },
            resetDetails(){
                this.model.details.show = false;
                this.model.details.type = undefined;
                this.model.details.label = undefined;
                this.model.details.blockId = undefined;
                this.model.details.block = undefined;
                
                this.model.details.configurables = [];
            }
        }
    }

    _toolbarController(){
        var self = this;
        this.toolbarController = {
            parent: self,
            model: {
                create: {
                    show: false,
                    title: '',
                    type: undefined,
                    label: undefined,
                    blockId: undefined
                }
            },
            dismiss: function(e, that){
                that.model.create.show = false;
            },
            addBlock: function(e, that){
                
                that.parent.emmiter.emit(EVENTS_DICT.EVENTS.BLOCK_CREATE, that.model.create.blockId, that.model.create.type, that.model.create.label, e);                
                that.resetCreate();
            },
            resetCreate(){
                this.model.create.type = undefined;
                this.model.create.show = false;
                this.model.create.title = '';
                this.model.create.label = undefined;
                this.model.create.blockId = undefined;                
            }
        }
    }

    _rivetize(){
        if(window&&window.rivets){
            var flowHtmlElement = helper.getElementByClass(this.flowClass)
            var toolbarHtmlElement = helper.getElementByClass(this.toolbarClass)
            window.rivets.bind(flowHtmlElement, this.flowController);
            window.rivets.bind(toolbarHtmlElement, this.toolbarController);
        }else{
            console.warn('For full interactivity rivets is required.');
        }
    }

    _bindFlowEvents(flowblocks){
        var self = this;
        // show block configuration view
        flowblocks.on(EVENTS_DICT.EVENTS.BLOCK_DBLCLICK, function(block, evt){
            
            

            self.flowController.model.details.show = true;
            self.flowController.model.details.type = block.get('_type');
            self.flowController.model.details.blockId = block.get('blockId');
            self.flowController.model.details.label = block.get('name');
            self.flowController.model.details.block = block;
            var typeDefinition = flowblocks.getDefinition(self.flowController.model.details.type);
            var configurables = typeDefinition.configurable ? typeDefinition.configurable.configurables : [];
            self.flowController.model.details.configurables.length = 0;
            
            configurables.forEach(configurable => {
                

                var configurableValue = block.get('configurables').find(el=>{return el.i == configurable.id}) ? block.get('configurables').find(el=>{return el.i == configurable.id}).v : undefined;
                

                self.flowController.model.details.configurables.push({
                    id: configurable.id,
                    label: configurable.label,
                    placeholder: configurable.placeholder,
                    type: configurable.type,
                    required: configurable.required,
                    value: configurableValue
                })
            });
        })
    }

    _bindToolbarEvents(flowblocks){
        var self = this;
        flowblocks.on('all', function(name){
            
        })
        flowblocks.on(EVENTS_DICT.EVENTS.TOOLBAR_ITEM_DBLCLICK, function(name){
            self.toolbarController.model.create.title = name
            self.toolbarController.model.create.show = true;
            self.toolbarController.model.create.type = name;
            self.toolbarController.model.create.blockId = shortid.generate();
        })
    }
}
module.exports = new Interactive({});