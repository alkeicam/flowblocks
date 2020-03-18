const jointjs = require("jointjs")

class Block {
    constructor(options) {
        this.options = {
            defaultSize: {
                width: 70,
                height: 70
            }
        };
        this.Model = {};
        this.View = {};
        Object.assign(this.options, options);
        this._initialize();
    }

    _initialize() {
        jointjs.shapes.flowblocks = {};

        this.Model = jointjs.shapes.devs.Model.define('flowblocks.Block', {
            // now model fields            
            name: '',
            icon: './resources/img/svg/agave.svg',
            status: 'ERROR', // OK, ERROR,
            statusMsg: 'OK',
            blockId: undefined,
            debug: true, // debug mode when blockId is presented
            errors: [], // array of block errors that are the cause for the ERROR status of the block
            _styles: {
                'americana': {
                    icon: undefined,
                    bodyColor: '#74b9ff',
                    titleBarColor: '#ffeaa7',
                    statusBarColor: '#fdcb6e',
                    portInColor: '#00cec9',
                    portOutColor: '#ff7675'
                },
                'original':{
                    icon: undefined,
                    bodyColor: '#3DB5FF',
                    titleBarColor: 'rgb(255, 230, 206)',
                    statusBarColor: 'rgb(209, 226, 208)',
                    portInColor: '#16A085',
                    portOutColor: '#E74C3C'
                },
                'cream' : {
                    icon: undefined,
                    bodyColor: '#FAE8FF',
                    titleBarColor: '#E1C2ED',
                    statusBarColor: '#E1C2ED',
                    portInColor: '#936DED',
                    portOutColor: '#F2EAD7'
                }
                
            },
            // stores number of ports of this element that are already connected
            _portsConnected: 0,
            // type of element
            _type: undefined,
            // array of ports and elements that are connected to each port
            _portConnections: [],   // {port: whether connected to in or out port, id: connected element id , bId: connected element block id, type: connected element type, }

            // now presentation fields
            attrs: {
                rect: {
                    'ref-width': '100%',
                    'fill': 'rgb(211, 55, 255)'
                },
                body: {
                    fill: '#ffffff',
                    stroke: '#000000'
                },
                link: {
                    refWidth: '100%',
                    refHeight: '100%',
                    xlinkShow: 'new',
                    cursor: 'pointer'
                },

                '.status-err': {
                    'refHeight': '25%',
                    'fill': 'rgb(204, 41, 0)',
                    'refY': '75%'

                },

                '.fb-icon-rect': {
                    'fill': '#3DB5FF'

                },
                '.fb-icon-image': {
                    'ref': '.fb-icon-rect'
                },

                '.fb-status-rect': {
                    'fill': 'rgb(209, 226, 208)'

                },
                '.fb-status-text': {
                    'ref': '.fb-status-rect',

                    'text-anchor': 'start',
                    'fill': 'black',
                    'y-alignment': 'middle'
                },

                '.fb-label-rect': {
                    'fill': 'rgb(255, 230, 206)'
                },
                '.fb-label-text': {
                    'ref': '.fb-label-rect',

                    'text-anchor': 'start',
                    'fill': 'black',
                    'y-alignment': 'middle'
                }

                // label: {
                //     fill: '#ffa500'
                // }

            }
            // defaults - object that contains properties to be assigned to every constructed instance of the subtype. 
            // Used for specifying default attributes.
        }, {
            // proto props - object that contains properties to be assigned on the subtype prototype. 
            // Intended for properties intrinsic to the subtype, not usually modified. Used for specifying shape markup.
            markup: [
                '<g class="rotatable">',
                '<rect class="body"/>',
                '<rect class="fb-icon-rect"/>',
                '<image class="fb-icon-image" href="//resources/img/svg/agave.svg" />',
                '<rect class="fb-label-rect"/>',
                '<text class="fb-label-text">Label</text>',
                '<rect class="fb-status-rect"/>',
                '<text class="fb-status-text"></text>',
                '</g>'
            ].join(''),

            initialize: function () {
                this.on('change:name change:icon change:status change:statusMsg change:size', function () {
                    this._updateMyModel();
                    this.trigger('flowblocks-block-update');
                }, this);

                // this.on('all',function(eName, thing){
                //     console.log(eName, thing);
                // })

                //this.updateRectangles();

                this._updateMyModel();                
                jointjs.shapes.devs.Model.prototype.initialize.apply(this, arguments);

                //joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
            },
            /**
             * Block available public operations
             */
            api: function () {
                var api = [
                    "element.set('name','my label');",
                    "element.set('position', {x:30, y:10});",
                    "element.set('size', {width:50, height: 50});",
                    "element.set('icon', 'https://unpkg.com/flowblocks/dist/resources/img/svg/vase.svg');",
                    "element.style({titleBarColor: '#FADB50'});",
                    "element.getStatus();",
                    "element.freePorts();",

                ];
                return api;
            },
            /**
             * Returns status of the block and eventuall errors connected with the block
             */
            getStatus(){
                return {
                    valid: this.get('status') == 'OK',
                    errors: this.get('errors')
                }
            },
            /**
             * Applies style for the block.
             * @param {*} style Either name of the available preset styles or style specification
             */
            style(style) {
                if(!style) return;

                if (typeof style === 'string' || style instanceof String) {
                    var presetStyle = this.get('_styles')[style.toLocaleLowerCase()];
                    if (presetStyle)
                        this.style(presetStyle);
                } else {
                    if (style.icon)
                        this.set('icon', style.icon);
                    if (style.bodyColor)
                        this.attr('.fb-icon-rect/fill', style.bodyColor)
                    if (style.titleBarColor)
                        this.attr('.fb-label-rect/fill', style.titleBarColor)
                    if (style.statusBarColor)
                        this.attr('.fb-status-rect/fill', style.statusBarColor)
                    if (style.portInColor) {
                        this.getPorts().forEach(port => {                            
                            if(port.group == 'in')
                                this.portProp(port.id, 'attrs/circle/fill', style.portInColor);
                        })
                    }

                    if (style.portOutColor){
                        this.getPorts().forEach(port => {
                            if(port.group == 'out')
                                this.portProp(port.id, 'attrs/circle/fill', style.portOutColor);
                        })
                    }                                    
                }
            },

            /**
             * Returns array of free ports of element.
             * One can filter by portType ('in' or 'out')
             * @param {*} portType When provided only free ports of given type are returned
             * @returns Array of ports that are free in given block
             */
            freePorts(portType) {
                var ports = this.getPorts().filter(port=>{                    
                    if(portType){
                        return port.group == portType;
                    } else
                        return true;                    
                });

                var usedPorts = this.get('_portConnections');

                // ports that are not used and can be connected
                var freePorts = [];

                ports.forEach(element => {
                    // find if current port is occupied
                    var usedPort = usedPorts.find(uPort => {
                        return uPort.port == element.id;
                    })
                    if (!usedPort) {
                        freePorts.push(element);
                    }
                })

                return freePorts;
            },

            _dumpConnections() {
                if (this.get('debug'))
                    console.log('Connections[' + this.get('blockId') + ']: ', JSON.stringify(this.get('_portConnections')));
            },
            /**
             * Revalidates block
             * One that wants to retrieve block status shall call getStatus().
             */
            _recalculateStatus() {
                var freePorts = this.freePorts();

                if (freePorts.length > 0){
                    this.set('status', 'ERROR');
                    freePorts.forEach(port=>{
                        this.get('errors').push({
                            code: 'PORT_NOT_CONNECTED',
                            cId: port.id,
                            msg: 'Port ['+port.id+'] is not connected'
                        })
                    })                    
                } else {
                    this.set('status', 'OK');
                    this.get('errors').length = 0; // reset errors array
                }
                    
                // console.log(this.get('blockId'),  freePorts.length, this.get('status'));
            },

            _handleDisconnect(block, port, linkId) {
                if(block==undefined)
                    return;
                var recordToRemove = this.get('_portConnections').find(element => {
                    return element.port == port && element.id == block.id && element.linkId == linkId;
                })

                var idxToRemove = this.get('_portConnections').findIndex(element => {
                    return element.port == port && element.id == block.id && element.linkId == linkId;
                })
                if (idxToRemove >= 0)
                    this.get('_portConnections').splice(idxToRemove, 1);
                // console.log('Disconnected',  this.get('blockId'), port, recordToRemove ? recordToRemove.bId: undefined);
                this._recalculateStatus();

            },

            _handleConnectFrom(participant, port, targetPort, linkId) {


                //console.log('ConnectFrom', port, participant);
                // {port: whether connected to in or out port, id: connected element id , bId: connected element block id, type: connected element type, }
                var item = {
                    port: port,
                    id: participant.get('id'),
                    bId: participant.get('blockId'),
                    type: participant.get('_type'),
                    targetPort: targetPort,
                    linkId: linkId
                }
                this.get('_portConnections').push(item);
                // console.log('Connect', this.get('blockId'), participant.get('blockId'),  port);
                this._recalculateStatus();
            },

            _handleConnectTo(participant, port, targetPort, linkId) {


                // console.log('ConnectTo', port, participant);
                // {port: whether connected to in or out port, id: connected element id , bId: connected element block id, type: connected element type, }
                var item = {
                    port: port,
                    id: participant.get('id'),
                    bId: participant.get('blockId'),
                    type: participant.get('_type'),
                    targetPort: targetPort,
                    linkId: linkId
                }
                this.get('_portConnections').push(item);
                // console.log('Connect', this.get('blockId'), participant.get('blockId'), port);
                this._recalculateStatus();
            },

            _recalculateRectWithLabel: function (classSelectorPrefix, label, elementHeight, fontSize, baseSize, positionY) {
                var attrs = this.get('attrs');
                // section height
                var partHeight = elementHeight * baseSize.height;

                var partFontSize = fontSize * partHeight;
                var fontY = positionY + partHeight / 2;
                var fontX = 0.1 * baseSize.width;

                this.attr(classSelectorPrefix + '-rect/height', partHeight);
                // attrs[classSelectorPrefix+'-rect'].height = partHeight;
                this.attr(classSelectorPrefix + '-rect/transform', 'translate(0,' + positionY + ')');
                // attrs[classSelectorPrefix+'-rect'].transform = 'translate(0,' + positionY + ')';

                this.attr(classSelectorPrefix + '-text/font-size', partFontSize);
                // attrs[classSelectorPrefix+'-text']['font-size'] = partFontSize;
                this.attr(classSelectorPrefix + '-text/transform', 'translate(' + fontX + ',' + fontY + ')');
                // attrs[classSelectorPrefix+'-text'].transform = 'translate(' + fontX + ',' + fontY + ')';                
                this.attr(classSelectorPrefix + '-text/text', label);

                return partHeight;
            },

            _recalculateRectWithIcon: function (classSelectorPrefix, iconHref, elementHeight, iconSize, baseSize, positionY) {
                var partHeight = elementHeight * baseSize.height;

                this.attr(classSelectorPrefix + '-rect/height', partHeight);
                this.attr(classSelectorPrefix + '-rect/transform', 'translate(0,' + positionY + ')');

                var iconHeight = iconSize * partHeight;
                var iconX = baseSize.width / 2 - iconHeight / 2;
                var iconY = positionY + partHeight / 2 - iconHeight / 2;

                this.attr(classSelectorPrefix + '-image/height', iconHeight);
                this.attr(classSelectorPrefix + '-image/transform', 'translate(' + iconX + ',' + iconY + ')');
                this.attr(classSelectorPrefix + '-image/href', iconHref);

                return partHeight;
            },

            // _recalculatePorts: function(baseSize){

            // }

            _updateMyModel: function () {
                var self = this;
                var offsetY = 0;
                var field = {
                    width: this.get('size').width,
                    height: this.get('size').height,
                    icon: this.get('icon'),
                    name: this.get('debug') ? this.get('name') + '[' + this.get('blockId') + ']' : this.get('name'),
                    statusMessage: this.get('statusMsg')
                }
                offsetY += self._recalculateRectWithLabel('.fb-label', field.name, 0.2, 0.6, field, offsetY);
                offsetY += self._recalculateRectWithIcon('.fb-icon', field.icon, 0.6, 0.8, field, offsetY);
                offsetY += self._recalculateRectWithLabel('.fb-status', field.statusMessage, 0.2, 0.3, field, offsetY);
            }
        }, {
            // static props - object that contains properties to be assigned on the subtype constructor. 
            // Not very common, used mostly for alternative constructor functions.
        })


        jointjs.shapes.flowblocks.BlockView = jointjs.dia.ElementView.extend({

            initialize: function () {

                jointjs.dia.ElementView.prototype.initialize.apply(this, arguments);

                this.listenTo(this.model, 'flowblocks-block-update', function () {
                    this.update();
                    this.resize();
                });
            }
        });
        this.View = jointjs.shapes.flowblocks.BlockView;
    }

    createBlank(blockId, template, statusDefinition, style) {
        var factories = {
            PassThrough: this.createPassThroughElement,
            Start: this.createStartElement,
            Split: this.createSplitElement,
            Join: this.createJoinElement,
            End: this.createSinkElement
        }
        if (factories[template]) {
            var block = factories[template].call(this, '', statusDefinition);
            // set id
            block.set('blockId',blockId);
            // apply style
            block.style(style);
            // calculate initial status of block 
            block._recalculateStatus();
            return block;
        } else {
            throw new Error('Unsuported template: ' + template);
        }
    }


    /**
     * Element with a single input and a dual output
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createSplitElement(name, statusDefinition, style) {
        var options = {
            position: { x: 40, y: 20 },
            size: this.options.defaultSize,
            inPorts: ['in'],
            outPorts: ['out1', 'out2'],
            ports: {
                groups: {
                    'in': {
                        attrs: {
                            '.port-body': {
                                fill: '#16A085',
                                magnet: 'passive'
                            }
                        }
                    },
                    'out': {
                        attrs: {
                            '.port-body': {
                                fill: '#E74C3C'
                            }
                        }
                    }
                },
            },
            attrs: {
                '.label': { text: 'Model', 'ref-x': .5, 'ref-y': .2 },
                rect: { fill: '#2ECC71' }
            }
        }
        var newBlock = new this.Model(options);                
        return newBlock;
    }

    /**
     * Element with a double input and a single output
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createJoinElement(name, statusDefinition, style) {
        var options = {
            position: { x: 40, y: 20 },
            size: this.options.defaultSize,
            inPorts: ['in1', 'in2'],
            outPorts: ['out'],
            ports: {
                groups: {
                    'in': {
                        attrs: {
                            '.port-body': {
                                fill: '#16A085',
                                magnet: 'passive'
                            }
                        }
                    },
                    'out': {
                        attrs: {
                            '.port-body': {
                                fill: '#E74C3C'
                            }
                        }
                    }
                }
            },
            attrs: {
                '.label': { text: 'Model', 'ref-x': .5, 'ref-y': .2 },
                rect: { fill: '#2ECC71' }
            }
        }
        var newBlock = new this.Model(options);        
        return newBlock;
    }

    /**
     * Element with a single input and a single output
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createPassThroughElement(name, statusDefinition, style) {
        var options = {
            position: { x: 40, y: 20 },
            size: this.options.defaultSize,
            inPorts: ['in'],
            outPorts: ['out'],
            ports: {
                groups: {
                    'in': {
                        attrs: {
                            '.port-body': {
                                fill: '#16A085',
                                magnet: 'passive'
                            }
                        }
                    },
                    'out': {
                        attrs: {
                            '.port-body': {
                                fill: '#E74C3C'
                            }
                        }
                    }
                }
            },
            attrs: {
                '.label': { text: 'Model', 'ref-x': .5, 'ref-y': .2 },
                rect: { fill: '#2ECC71' }
            }
        }
        var newBlock = new this.Model(options);
        return newBlock;
    }


    /**
     * Starting element
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createStartElement(name, statusDefinition, style) {
        var options = {
            position: { x: 40, y: 20 },
            size: this.options.defaultSize,
            outPorts: ['out'],
            ports: {
                groups: {
                    'out': {
                        attrs: {
                            '.port-body': {
                                fill: '#E74C3C'
                            }
                        }
                    }
                }
            },
            attrs: {
                '.label': { text: 'Model', 'ref-x': .5, 'ref-y': .2 },
                rect: { fill: '#2ECC71' }
            }
        }
        var newBlock = new this.Model(options);
        return newBlock;
    }

    /**
     * Finish (sink) element
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createSinkElement(name, statusDefinition, style) {
        var options = {
            position: { x: 40, y: 20 },
            size: this.options.defaultSize,
            inPorts: ['in'],
            ports: {
                groups: {
                    'in': {
                        attrs: {
                            '.port-body': {
                                fill: '#16A085',
                                magnet: 'passive'
                            }
                        }
                    },
                }
            }, rs: {
                '.label': { text: 'Model', 'ref-x': .5, 'ref-y': .2 },
                rect: { fill: '#2ECC71' }
            }
        }
        var newBlock = new this.Model(options);
        return newBlock;
    }
}
module.exports = new Block({});