const jointjs = require("jointjs")
const DEFAULTS = require('./defaults')
const EVENTS_DICT = require('./events-dict')

class Drawer {
    constructor(){
        this.elementId = undefined;
        this.category = undefined;
        this.graph = undefined;
        this.paper = undefined;
        this.emitter = undefined;
        this.state = undefined;         
        this._items = [];
        this.options = {
            size: DEFAULTS.TOOLBAR.SIZE,
            padding: DEFAULTS.TOOLBAR.PADDING,
            rowPadding: DEFAULTS.TOOLBAR.ROW_PADDING,
        };
    }

    /**
     * Creates empty and detached Drawer. One can populate Drawer contents but the Drawer must be attached
     * to HTML element in order for elements to be presented.
     * @param {*} category 
     * @param {*} emitter 
     */
    create(category,  emitter){
        this.state = 'UNATTACHED';
        this.category = category;        
        this.emitter = emitter;
    }

    removeAllItems(){
        var self = this;        
        this.graph.removeCells(this._items);
        this._items = [];
    }
 
    /**
     * Adds item to the Drawer. When the Drawer is attached then item is immediately being displayed, otherwise
     * item is stored and will be presented only when the drawer becomes attached.
     * @param {*} item 
     */
    addItem(item){
        var self = this;
        this._items.push(item);    
        this._add(item);
        return item;       
    }
    /**
     * When Drawer is attached then item is added to the underlying model and presented in the Drawer.
     * When Drawer is detached then nothing happens.
     * @param {*} item To be presented in the Drawer
     */
    _add(item){
        if(this.state == 'UNATTACHED'){
            this.state = 'PENDING';
            // for detached toolbar request element to which the toolbar may be attached. And await for a drawer to be attached to HTML element
            this.emitter.emit(EVENTS_DICT.EVENTS.TOOLBAR_DRAWER_REQUEST, this.category);
            return item;
        }
        
        // add to graph 
        this.graph.addCell(item);    
        // resize
        this._resizeItem(item);
        // reposition items on paper
        this._repositionItems();
    }

    /**
     * Attaches Drawer to the HTML element. As a result 
     * drawer contents are drawn and become operational.
     * 
     * @param {*} elementId Element to which drawer will be attached (drawn)
     */
    _attach(elementId){
        var self = this;
        this.elementId = elementId;
        this.graph = new jointjs.dia.Graph;
        // create paper
        this.paper = new jointjs.dia.Paper({
            el: document.getElementById(elementId),
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

        // enable toolbar events
        self._bindEvents();

        // add all items to graph and paper (draw the drawer)
        this._items.forEach(item=>{
            this._add(item);
        })
        // mark drawer as attached
        this.state = 'ATTACHED';
        // console.log('Drawer attached ', this.category, this.elementId);
        // notify that drawer is attached
        this.emitter.emit(EVENTS_DICT.EVENTS.TOOLBAR_DRAWER_ATTACHED, this.category, this.elementId);

        
    }

    /**
     * Binds interaction events that allow to drag flowblocks elements from toolbar to the 
     * main flowblocks diagram.
     */
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

    _repositionItems() {
        var self = this;
        var previousPosition = {
            x: 15,
            y: 5
        }

        var paperHeight = 0;
        

        this._items.forEach(item => {

            var view = item.findView(this.paper);
            // var itemSize = item.get('size');
            // var itemPosition = item.get('position');



            var newPosition = {

                x: previousPosition.x,
                y: previousPosition.y + view.getBBox().height / 6
            }
            // console.log('BEFORE: ', item.get('_type'),item.get('position'), previousPosition, newPosition, item.getBBox().height, view.getBBox().height);
            // update paper size
            paperHeight = newPosition.y + view.getBBox().height;
            self.paper.setDimensions(self.paper.width, paperHeight);
            
            item.set('position', newPosition);

            

            previousPosition = {
                x: newPosition.x,
                y: newPosition.y + view.getBBox().height
            }
            // console.log('AFTER: ', item.get('_type'),item.get('position'));
        })
    }
}

class Toolbar {
    constructor(options) {        
        this.emitter = undefined;
        this.drawers = [];
        this.options = {};
        Object.assign(this.options, options);
        this._initialize();
    }
    _initialize() {
    }

    create(emitter) {
        var self = this;
        this.emitter = emitter;
        this._bindAppEvents();
        return this;
    }   

    _bindAppEvents() {        
        var self = this;

        // binds paper for the given drawer when html presentation element is ready - we try to 
        // attached proper Drawer to the HTML element
        this.emitter.on(EVENTS_DICT.EVENTS.TOOLBAR_DRAWER_READY,function(category, elementId){
            // console.log('Drawer is ready', category, elementId);
            // find drawer
            var matchingDrawer = self.drawers.find(drawer=>{
                return drawer.category == category;
            })
            // console.log('Matching drawer ', matchingDrawer);
            if(matchingDrawer){
                matchingDrawer._attach(elementId);                
            }
        })
    }

    /**
     * Cleans toolbar
     */
    removeAllItems(){
        this.drawers.forEach(drawer=>{
            drawer.removeAllItems();
        })
    }
    /**
     * Adds item to given category in toolbar.
     * @param {*} item 
     * @param {*} category 
     */
    addItem(item, category) {
        // znajdz drawer. dodaj item
        var drawer = this.drawers.find(drawer=>{
            return drawer.category == category;
        })
        
        if(!drawer){
            // when there is no drawer for a category create a new Drawer
            drawer = new Drawer();
            
            // initialize Drawer (in a detached state)
            drawer.create(category, this.emitter);
            this.drawers.push(drawer);
        }

        drawer.addItem(item);
    }
}
module.exports = new Toolbar({});