const jointjs = require("jointjs")
const DEFAULTS = require('./defaults')
const EVENTS_DICT = require('./events-dict')


class Toolbar {
    constructor(options) {
        this.options = {
            size: DEFAULTS.TOOLBAR.SIZE,
            padding: DEFAULTS.TOOLBAR.PADDING,
            rowPadding: DEFAULTS.TOOLBAR.ROW_PADDING,
        };
        this.graph = {};
        this.paper = {};
        this._items = [];
        this.emitter = undefined;
        Object.assign(this.options, options);
        this._initialize();
    }
    _initialize() {
    }

    create(div, emitter) {
        var self = this;
        this.emitter = emitter;
        this.graph = new jointjs.dia.Graph;
        this.paper = new jointjs.dia.Paper({

            el: document.getElementById(div),
            width: self.options.size.width,
            height: self.options.size.height,
            gridSize: 1,
            model: self.graph,
            background: {
                color: 'transparent'
            },
            interactive: false,
            // interactive: {
            //     addLinkFromMagnet: false,
            //     elementMove: false
            // },
            snapLinks: false,
            linkPinning: false,
            embeddingMode: false,
            clickThreshold: 5,
            defaultConnectionPoint: { name: 'boundary' },

            validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                return false
            }
        });
        this._bindEvents();        
        return this;
    }   

    addItem(item) {
        this._resizeItem(item);
        this._items.push(item);
        this.graph.addCell(item);

        this._repositionItems()
    }

    _resizeItem(item) {
        var toolbarWidth = this.options.size.width;
        var padding = 2 * this.options.padding.x;
        var percentage = 0.2
        padding *= (1 + percentage);
        var calculatedWidth = toolbarWidth - padding;

        item.set('size', {
            width: calculatedWidth,
            height: calculatedWidth
        })

    }

    _bindEvents() {
        var self = this;
        // adding by doubleclick
        // this.paper.on('element:pointerdblclick', function (toolView, evt) {            
        //     var typeClicked = toolView.model.get('_type');                        
        //     self.emitter.emit(EVENTS_DICT.EVENTS.TOOLBAR_ITEM_DBLCLICK, typeClicked, evt)                        
        //     evt.preventDefault();
        // });

        // adding by dragging
        this.paper.on('cell:pointerdown', function(cellView, e, x, y){
        // this.paper.on('cell:pointerclick', function(cellView, e, x, y){            
            var block = cellView.model;            
            var typeClicked = block.get('_type');    
            self.emitter.emit(EVENTS_DICT.EVENTS.TOOLBAR_ITEM_DRAG, typeClicked, block, x, y, e);
        })
    }

    _repositionItems() {
        var previousPosition = {
            x: 20,
            y: 20
        }

        this._items.forEach(item => {

            var view = item.findView(this.paper);
            // var itemSize = item.get('size');
            // var itemPosition = item.get('position');

            var newPosition = {

                x: previousPosition.x,
                y: previousPosition.y + view.getBBox().height / 6
            }
            // console.log('BEFORE: ', item.get('_type'),item.get('position'), previousPosition, newPosition, item.getBBox().height, view.getBBox().height);

            item.set('position', newPosition);

            previousPosition = {
                x: newPosition.x,
                y: newPosition.y + view.getBBox().height
            }
            // console.log('AFTER: ', item.get('_type'),item.get('position'));
        })
    }
}
module.exports = new Toolbar({});