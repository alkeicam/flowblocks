class Toolbar {
    constructor(options) {        
        this.options = {
        };
        this.graph = {};
        this.paper = {};
        this._items = [];
        Object.assign(this.options, options);
        this._initialize(); 
    }    
    _initialize() {
    }

    create(div) {
        var self = this;
        this.graph = new jointjs.dia.Graph;
        this.paper = new jointjs.dia.Paper({

            el: document.getElementById(div),
            width: '100%',
            height: 100,
            gridSize: 1,
            model: self.graph,
            // background: {
            //     color: '#F2EAD7'
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
        return this;
    }

    addItem(item) {
        this._items.push(item);
        this.graph.addCell(item);        
    }
}
module.exports = new Toolbar({});