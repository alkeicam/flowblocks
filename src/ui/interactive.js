const helper = require('../helper')
const EVENTS_DICT = require('../events-dict')

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
        this.flowClass = flowClass;
        this.toolbarClass = toolbarClass;  
        this.flowblocks = flowblocks;
        this._toolbarController();      
        this._rivetize();
        this._bindEvents(flowblocks);
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
                that.parent.flowblocks.createBlock(that.model.create.type,that.model.create.label,that.model.create.blockId);
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

    _bindEvents(flowblocks){
        var self = this;
        flowblocks.on('all', function(name){
            
        })
        flowblocks.on(EVENTS_DICT.EVENTS.TOOLBAR_ITEM_DBLCLICK, function(name){
            self.toolbarController.model.create.title = name
            self.toolbarController.model.create.show = true;
            self.toolbarController.model.create.type = name;
        })
    }
}
module.exports = new Interactive({});