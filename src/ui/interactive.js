const helper = require('../helper')
const EVENTS_DICT = require('../events-dict')
const shortid = require('shortid');
const DEFAULTS = require('../defaults')
const MenuController = require('./menu-controller')

class Interactive {
    constructor(options) {
        this.emmiter = undefined;
        this.flowClass = undefined;
        this.menuClass = undefined;
        this.toolbarClass = undefined
        this.flowblocks = undefined
        this.flowController = {}
        this.toolbarController = undefined
        this.menuController = MenuController;
    }

    create(flowblocks, emmiter, flowClass, toolbarClass, menuClass, menuContents) {
        this.emmiter = emmiter;
        this.flowClass = flowClass;
        this.toolbarClass = toolbarClass;
        this.menuClass = menuClass;
        this.flowblocks = flowblocks;
        this.menuController.create(emmiter, menuContents);
        this._flowController();
        this._toolbarController();
        this._rivetize();
        this._bindMenuEvents(flowblocks);
        this._bindFlowEvents(flowblocks);
        this._bindToolbarEvents(flowblocks);
    }

    _flowController() {
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
                },
                types: {
                    create: {
                        show: false
                    }
                },
                general: {
                    busy: false,
                    doneOk: false
                }
            },
            isBusy(){
                return this.model.general.busy;
            },
            busy(){
                this.model.general.busy = true;
                this.model.general.doneOk = false;
            },
            done(result){
                var self = this;
                this.model.general.busy = false;
                this.model.general.doneOk = true;                
                setTimeout(function () { self.model.general.doneOk = false;}, 4000);
            },
            dismiss: function (e, that) {
                that.model.details.show = false;
                that.resetDetails();
            },
            detailsSave: function (e, that) {
                var block = self.flowController.model.details.block;

                var configurables = [];
                that.model.details.configurables.forEach(item => {
                    configurables.push({
                        i: item.id,
                        v: item.value
                    })
                })

                that.parent.emmiter.emit(EVENTS_DICT.EVENTS.BLOCK_DETAILS_SAVE, block.get('blockId'), configurables, e);
                that.resetDetails();
            },
            resetDetails() {
                this.model.details.show = false;
                this.model.details.type = undefined;
                this.model.details.label = undefined;
                this.model.details.blockId = undefined;
                this.model.details.block = undefined;

                this.model.details.configurables = [];
            }
        }
    }

    _toolbarController() {
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
                },
                drawers: []
            },
            dismiss: function (e, that) {
                that.model.create.show = false;
            },
            addBlock: function (e, that) {

                that.parent.emmiter.emit(EVENTS_DICT.EVENTS.BLOCK_CREATE, that.model.create.blockId, that.model.create.type, that.model.create.label, that.model.create.position, e);
                that.resetCreate();
            },
            /**
             * Adds Drawer record to HTML controller so the corresponding HTML element can be redered
             * @param {*} category 
             */
            addDrawer(category){
                var lastIndex = this.model.drawers.length;
                var elementId = 'flowblocks-toolbar-drawer'+lastIndex;
                this.model.drawers.push({
                    category: category,
                    id: elementId
                })

                // notify app that the drawer element is ready in HTML so the Drawer
                // can be attached to it
                this.parent.emmiter.emit(EVENTS_DICT.EVENTS.TOOLBAR_DRAWER_READY, category, elementId);
            },
            resetCreate() {
                this.model.create.type = undefined;
                this.model.create.show = false;
                this.model.create.title = '';
                this.model.create.label = undefined;
                this.model.create.blockId = undefined;
            }
        }
    }

    _rivetize() {
        if (window && window.rivets) {
            var flowHtmlElement = helper.getElementByClass(this.flowClass)
            var toolbarHtmlElement = helper.getElementByClass(this.toolbarClass)
            var menuHtmlElement = helper.getElementByClass(this.menuClass)
            window.rivets.bind(menuHtmlElement, this.menuController);
            window.rivets.bind(flowHtmlElement, this.flowController);
            window.rivets.bind(toolbarHtmlElement, this.toolbarController);
        } else {
            console.warn('For full interactivity rivets is required.');
        }
    }

    _bindFlowEvents(flowblocks) {
        var self = this;
        // show block configuration view
        flowblocks.on(EVENTS_DICT.EVENTS.BLOCK_DBLCLICK, function (block, evt) {



            self.flowController.model.details.show = true;
            self.flowController.model.details.type = block.get('_type');
            self.flowController.model.details.blockId = block.get('blockId');
            self.flowController.model.details.label = block.get('name');
            self.flowController.model.details.block = block;
            var typeDefinition = flowblocks.getDefinition(self.flowController.model.details.type);
            var configurables = typeDefinition.configurable ? typeDefinition.configurable.configurables : [];
            self.flowController.model.details.configurables.length = 0;

            configurables.forEach(configurable => {


                var configurableValue = block.get('configurables').find(el => { return el.i == configurable.id }) ? block.get('configurables').find(el => { return el.i == configurable.id }).v : undefined;

                if (!configurableValue && configurable.default)
                    configurableValue = configurable.default;


                var options = [];
                if (configurable.options) {
                    configurable.options.forEach(option => {
                        options.push({
                            v: option.v,
                            l: option.l
                        })
                    })
                }

                self.flowController.model.details.configurables.push({
                    id: configurable.id,
                    label: configurable.label,
                    placeholder: configurable.placeholder,
                    type: configurable.type,
                    required: configurable.required,
                    value: configurableValue,
                    options: options
                })
            });
        })

        flowblocks.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_DONE_SUCCESS, function(){                        
            if(!self.flowController.isBusy()){
                setTimeout(function () { self.flowController.done(true);}, 1000);
                
            }else{
                self.flowController.done(true);
            }
            
        })
    }

    _bindMenuEvents(flowblocks) {
        var self = this;
        flowblocks.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_TYPE_CREATE, function(){            
            self.flowController.busy();
        })
        flowblocks.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_SAVE, function(){            
            self.flowController.busy();
        })
        flowblocks.on(EVENTS_DICT.EVENTS.FLOWBLOCKS_DOWNLOAD, function(){                        
            self.flowController.busy();
        })
    }

    _bindToolbarEvents(flowblocks) {
        var self = this;
        // flowblocks.on('all', function (name) {

        // })

        flowblocks.on(EVENTS_DICT.EVENTS.TOOLBAR_DRAWER_REQUEST, function (category) {
            // console.log('Drawer requested ', category);
            // when toolbar requests drawer we must provide HTML element to which
            // tolbar drawer may be attached and displayed
            self.toolbarController.addDrawer(category);

        }); 

        flowblocks.on(EVENTS_DICT.EVENTS.TOOLBAR_ITEM_DBLCLICK, function (typeName) {
            self.toolbarController.model.create.title = typeName
            self.toolbarController.model.create.show = true;
            self.toolbarController.model.create.type = typeName;
            self.toolbarController.model.create.blockId = shortid.generate();
        })

        flowblocks.on(EVENTS_DICT.EVENTS.TOOLBAR_ITEM_DRAG, function (typeName, block, x, y, e) {
            // dragging as presented in https://codepen.io/fxaeberard/pen/reGvjm

            $('body').append('<div id="flyPaper" style="position:fixed;z-index:100;opacity:.8;pointer-event:none;"></div>');
            var flyGraph = new joint.dia.Graph,
                flyPaper = new joint.dia.Paper({
                    el: $('#flyPaper'),
                    model: flyGraph,
                    interactive: false,
                    width: DEFAULTS.TOOLBAR.DRAG.SIZE.width,
                    height: DEFAULTS.TOOLBAR.DRAG.SIZE.height,
                    background: {
                        color: 'transparent'
                    },
                }),
                flyShape = block.clone(),
                pos = block.position(),
                offset = {
                    x: x - pos.x,
                    y: y - pos.y
                };
        
            flyShape.position(DEFAULTS.POSITION.x, DEFAULTS.POSITION.y);
            flyGraph.addCell(flyShape);
            $("#flyPaper").offset({
                left: e.pageX - offset.x - DEFAULTS.POSITION.x,
                top: e.pageY - offset.y - DEFAULTS.POSITION.y
            });
            $('body').on('mousemove.fly', function (e) {
                $("#flyPaper").offset({
                    left: e.pageX - offset.x - DEFAULTS.POSITION.x,
                    top: e.pageY - offset.y - DEFAULTS.POSITION.y
                });
            });
            $('body').on('mouseup.fly', function (e) {
                var x = e.pageX,
                    y = e.pageY,
                    target = flowblocks.flow.paper.$el.offset();    // target paper
        
                // Dropped over paper ?
                if (x > target.left && x < target.left + flowblocks.flow.paper.$el.width() && y > target.top && y < target.top + flowblocks.flow.paper.$el.height()) {
                    // here we add
                    // var s = flyShape.clone();
                    // s.position(x - target.left - offset.x, y - target.top - offset.y);
                    // graph.addCell(s);


                    self.toolbarController.model.create.title = typeName
                    self.toolbarController.model.create.show = true;
                    self.toolbarController.model.create.type = typeName;
                    self.toolbarController.model.create.position = {
                        x: x - target.left - offset.x,
                        y: y - target.top - offset.y
                    }
                    self.toolbarController.model.create.blockId = shortid.generate();
                }
                $('body').off('mousemove.fly').off('mouseup.fly');
                flyShape.remove();
                $('#flyPaper').remove();
            });

            // ////////

            // // add temporary div
            // $('body').append('<div id="flowblocks-drag" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>');

            // // create temporary graph for moving
            // var dragGraph = new joint.dia.Graph;
            // var dragPaper = new joint.dia.Paper({
            //     el: $('#flowblocks-drag'),
            //     model: dragGraph,
            //     interactive: false
            // })
            // var dragBlock = block.clone(),
            // var pos = block.position(),
            // var offset = {
            //     x: x - pos.x,
            //     y: y - pos.y
            // };

            // dragBlock.position(0, 0);
            // dragGraph.addCell(dragBlock);
            
            // // here goes dragging - initialize
            // $("#flowblocks-drag").offset({
            //     left: e.pageX - offset.x,
            //     top: e.pageY - offset.y
            // });
            
            // // drag when mouse moves
            // $('body').on('mousemove.fly', function (e) {
            //     $("#flowblocks-drag").offset({
            //         left: e.pageX - offset.x,
            //         top: e.pageY - offset.y
            //     });
            // });

            // // drag ends
            // $('body').on('mouseup.fly', function(e) {
            //     var x = e.pageX,
            //       y = e.pageY,
            //       target = paper.$el.offset();
                
            //     // Dropped over paper ?
            //     if (x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
            //       var s = flyShape.clone();
            //       s.position(x - target.left - offset.x, y - target.top - offset.y);
            //       graph.addCell(s);
            //     }
            //     $('body').off('mousemove.fly').off('mouseup.fly');
            //     flyShape.remove();
            //     $('#flyPaper').remove();
            //   });



        })
    }
}
module.exports = new Interactive({});