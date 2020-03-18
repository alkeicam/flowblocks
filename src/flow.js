const jointjs = require("jointjs")
const helper = require('./helper')

class Flow {
    constructor(options) {
        this.options = {
        };
        this.graph = {};
        this.paper = {};
        this._blocks = [];
        Object.assign(this.options, options);
        this._initialize();
    }

    _initialize() {
    }

    create(paperDivId) {
        var self = this;
        this.graph = new jointjs.dia.Graph;
        this.paper = new jointjs.dia.Paper({

            el: document.getElementById(paperDivId),
            width: 1400,
            height: 1000,
            gridSize: 1,
            model: self.graph,
            snapLinks: true,
            linkPinning: false,
            embeddingMode: true,
            clickThreshold: 5,
            defaultLink: new jointjs.dia.Link({
                attrs: {
                    '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
                    '.connection': { stroke: 'blue' },
                    '.marker-source': { d: 'M 15 0 L 0 5 L 15 15 z', opacity: '0', stroke: 'orange' },
                    '.marker-arrowhead[end="source"]': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z', opacity: '0' }
                }
            }),
            defaultConnectionPoint: { name: 'boundary' },
            highlighting: {
                'default': {
                    name: 'stroke',
                    options: {
                        padding: 6
                    }
                },
                'embedding': {
                    name: 'addClass',
                    options: {
                        className: 'highlighted-parent'
                    }
                }
            },

            validateEmbedding: function (childView, parentView) {
                return parentView.model instanceof jointjs.shapes.devs.Coupled;
            },

            validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                // console.log('Source', cellViewS, magnetS )
                var sourceElement = cellViewS.model;

                // console.log('Target', cellViewT, magnetT )
                var targetElement = cellViewT.model;
                return magnetS != magnetT && magnetT.getAttribute('port-group') == 'in' && cellViewS != cellViewT;
            },
            validateMagnet: function (cellView, magnet, evt) {

                // by default passive magnets cant create connections
                if (magnet.getAttribute('magnet') == 'passive') {
                    return false;
                }
                // check if there is a free output port
                var sourceElement = cellView.model;
                var freePorts = sourceElement.freePorts('out')

                return freePorts.length > 0;
            }
        });

        joint.dia.Link.prototype.toolMarkup = [
            '<g class="link-tool">',
            '<g class="tool-remove" event="remove">',
            '<circle r="11" />',
            '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />',
            '<title>Remove link.</title>',
            '</g>',
            '</g>' // <-- missing
        ].join('');

        this._bindConnectionEvents();
        this._bindToolsEvents();
        return this;
    }

    _bindToolsEvents() {
        this.paper.on('element:mouseenter', function (view) {
            view.showTools();
        });

        this.paper.on('element:mouseleave', function (view) {
            view.hideTools();
        });
    }
    _bindConnectionEvents() {
        var self = this;

        this.paper.on('link:connect', function (linkView, evt, elementViewConnected, magnet, arrowhead) {

            var newParticipants = helper.linkGetParticipants(linkView.model, self);

            var sourceElement = newParticipants.sourceElement;
            var targetElement = newParticipants.targetElement;



            var sourcePort = newParticipants.sourcePort;
            var targetPort = newParticipants.targetPort;


            var previousTargetElement = elementViewConnected.model
            var previousTargetPort = magnet.getAttribute('port');

            // console.log('CONNECTED ', sourceElement, sourcePort, targetElement, targetPort, previousTargetElement, previousTargetPort);

            sourceElement._handleConnectTo(targetElement, sourcePort, targetPort, linkView.model.id);
            targetElement._handleConnectFrom(sourceElement, targetPort, sourcePort, linkView.model.id);
        })

        this.paper.on('link:disconnect', function (link, evt, elementViewDisconnected, magnet, arrowhead) {

            var participants = helper.linkGetParticipants(link.model, self);

            var sourceElement = participants.sourceElement;
            var targetElement = elementViewDisconnected.model

            // var targetPort = magnet.getAttribute('port');
            var targetPort = participants.targetPort;
            var sourcePort = participants.sourcePort;
            var newTargetElement = participants.targetElement;

            // console.log(sourceElement, targetElement, newTargetElement);
            if (targetElement != undefined && sourceElement != undefined) {
                sourceElement._handleDisconnect(targetElement, sourcePort, link.model.id);
                targetElement._handleDisconnect(sourceElement, targetPort, link.model.id);
            }
        })
        this.graph.on('remove', function (cell) {

            if (cell.isLink()) {
                var participants = helper.linkGetParticipants(cell, self);

                var sourceElement = participants.sourceElement;
                var targetElement = participants.targetElement;

                var sourcePort = participants.sourcePort;
                var targetPort = participants.targetPort;
                if (targetElement != undefined && sourceElement != undefined) {
                    sourceElement._handleDisconnect(targetElement, sourcePort, cell.id);
                    targetElement._handleDisconnect(sourceElement, targetPort, cell.id);
                }

                // if (participants)
                //     console.log('Removed:', participants.sourceElement, participants.sourcePort, participants.targetElement, participants.targetPort);                    
            } else {
                console.log('delete');
                var blockToDelete = cell;
                // Stop any further actions with the element view e.g. dragging
                // evt.stopPropagation();
                // remove the block 
                self._blocks = self._blocks.filter(block => {
                    return block.id != blockToDelete.id
                })
                self._blocks.forEach(block => {
                    block._handleDelete(blockToDelete);
                })
                // blockToDelete.remove();
                // if (confirm('Are you sure you want to delete this element?')) {
                //     elementView.model.remove();
                // }
            }

        })
    }

    addBlock(block) {
        this._blocks.push(block);
        this.graph.addCell(block);
        block._enableRemoval(this.paper);
    }



    enablePanAndZoom(panAndZoom) {
        var pzController = panAndZoom(document.querySelector('[joint-selector=svg]'), {
            fit: false,
            panEnabled: false,
            controlIconsEnabled: true,
            center: false,
            dblClickZoomEnabled: false,
            minZoom: 0.3
        });

        //Enable pan when a blank area is click (held) on
        this.paper.on('blank:pointerdown', function (evt, x, y) {
            pzController.enablePan();
        });

        //Disable pan when the mouse button is released
        this.paper.on('cell:pointerup blank:pointerup', function (cellView, event) {
            pzController.disablePan();
        });
    }

    validate() {
        var isOK = true;
        var errorBlocks = [];
        this._blocks.forEach(block => {
            var blockStatus = block.getStatus();


            if (!blockStatus.valid) {
                errorBlocks.push({
                    blockId: block.get('blockId'),
                    errors: blockStatus.errors
                });
            }

            isOK = isOK && blockStatus.valid;
        })
        return {
            valid: isOK,
            errorBlocks: errorBlocks,
        };
    }

}
module.exports = new Flow({});
