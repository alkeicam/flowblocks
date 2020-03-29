const jointjs = require("jointjs")
const DEFAULTS = require('./defaults')

class Block {
    constructor(options) {
        this.options = {
            defaultSize: DEFAULTS.SIZE,
            defaultPosition: DEFAULTS.POSITION,
            defaultPositionDelta: DEFAULTS.POSITION_DELTA            
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
            debug: false, // debug mode when blockId is presented
            errors: [], // array of block errors that are the cause for the ERROR status of the block
            configurables: [], // configurable values {i: id, v: value}
            _validationFunction: undefined, // validation function
            _style: undefined,
            _defaultStyle: DEFAULTS.STYLE,
            _styles: DEFAULTS.STYLES,
            // stores number of ports of this element that are already connected
            _portsConnected: 0,
            // type of element
            _type: undefined,
            // array of ports and elements that are connected to each port
            _portConnections: [],   // {port: whether connected to in or out port, id: connected element id , bId: connected element block id, type: connected element type, }

            // now presentation fields
            attrs: {
                rect: {                    
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
                    'ref-width': '100%',
                    'fill': '#3DB5FF'

                },
                '.fb-icon-image': {
                    'ref': '.fb-icon-rect'
                },

                '.fb-status-rect': {
                    'ref-width': '100%',
                    'fill': 'rgb(209, 226, 208)'

                },
                '.fb-status-text': {
                    'ref': '.fb-status-rect',

                    'text-anchor': 'start',
                    'fill': 'black',
                    'y-alignment': 'middle'
                },

                '.fb-label-rect': {
                    'ref-width': '100%',
                    'fill': 'rgb(255, 230, 206)'
                },
                '.fb-validation-rect': {
                    'fill': '#d63031'
                },
                '.fb-label-text': {
                    'ref': '.fb-label-rect',

                    'text-anchor': 'start',
                    'fill': 'black',
                    'y-alignment': 'middle'
                },
                '.fb-type-label-text': {                    
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
                '<rect class="fb-validation-rect"/>',
                '<text class="fb-type-label-text"></text>',                
                '</g>'
            ].join(''),

            initialize: function () {
                this.on('change:name change:icon change:status change:errors change:statusMsg change:size change:_type', function () {
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
             * Validation function input:
             * var blockData = {
                    blockId: this.get('blockId'),
                    type: this.get('_type'),
                    configurables: Object.assign({},this.get('configurables')),
                    connections: portConnectionsCopy
                }

             * Validation function output:
             * Array of errors, each error must have a form of: 
             *    code: error code,
             *    cId: element/object id that generated this error (for instance port id)
             *    msg: error message to be displayed
             * @param {*} validationFunction 
             */
            applyValidation(validationFunction){
                if(!validationFunction) return;
                this.set('_validationFunction', validationFunction); 
                this.set('_validationSource', validationFunction.toString());                
            },
            /**
             * Used during import, reinstantiates and binds custom validation 
             * functions to blocks
             */
            _reApplyValidation(){
                if(this.get('_validationSource')){                  
                    this.set('_validationFunction', new Function("return " + this.get('_validationSource'))()); 
                }
            },

            /**
             * Gets style definition. When style is already a style definition then nothing changes. Otherwise
             * either default style definition is applied or a style definition with given name is returned.
             * @param {*} style 
             */
            _getStyle(style){
                var returnStyle = undefined;
                // when no style provided then return default
                if(!style){                    
                    returnStyle = this.get('_defaultStyle');                    
                } else if (typeof style === 'string' || style instanceof String) {
                    // when style name provided then load style definition
                    returnStyle = this.get('_styles')[style.toLocaleLowerCase()];                    
                } else {
                    // when style object provided return the style definition that
                    // is provided in object
                    returnStyle = style;
                }
                return returnStyle;
            },

            _getPortGroup(groupType){
                var ports = this.attributes.ports || {};
                var groups = ports.groups || {};
                var portGroup = groups[groupType];
                return portGroup;                
            },

            /**
             * Applies style for the block.
             * @param {*} style Either name of the available preset styles or style specification
             */
            style(style) {
                var calulatedStyle = this._getStyle(style);
                if(calulatedStyle){
                    this.set('_style', calulatedStyle);                
                    if (calulatedStyle.bodyColor)
                        this.attr('.fb-icon-rect/fill', calulatedStyle.bodyColor)
                    if (calulatedStyle.titleBarColor)
                        this.attr('.fb-label-rect/fill', calulatedStyle.titleBarColor)
                    if (calulatedStyle.statusBarColor)
                        this.attr('.fb-status-rect/fill', calulatedStyle.statusBarColor)
                    if (calulatedStyle.portInColor) {
                        this.getPorts().forEach(port => {                            
                            if(port.group == 'in'){
                                console.log(port);
                                this.portProp(port.id, 'attrs/.port-body/fill', calulatedStyle.portInColor);
                                // .port-body

                                // FIXME hmm not elegant and probably may break in the future
                                var portGroup = this._getPortGroup('in');
                                if(portGroup && portGroup.attrs){
                                    var groupPortBody = portGroup.attrs['.port-body'] || {};
                                    groupPortBody.fill = calulatedStyle.portInColor;
                                }
                                
                            }
                                
                        })
                    }
                    if (calulatedStyle.portOutColor){                        
                        this.getPorts().forEach(port => {
                            if(port.group == 'out'){                                
                                //this.portProp(port.id, 'attrs/circle/fill', style.portOutColor);
                                this.portProp(port.id, 'attrs/.port-body/fill', calulatedStyle.portOutColor);
                                // FIXME hmm not elegant and probably may break in the future
                                var portGroup = this._getPortGroup('out');
                                if(portGroup && portGroup.attrs){
                                    var groupPortBody = portGroup.attrs['.port-body'] || {};
                                    groupPortBody.fill = calulatedStyle.portOutColor;
                                }
                            }
                                
                        })
                    }
                }

            },

            setConfigurables(configurables){
                this.set('configurables', configurables);
                this._recalculateStatus();
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

            _statusToString(){
                var msg = 'Block validation state: '+this.get('status');

                this.get('errors').forEach(error=>{
                    msg += " | "+error.msg
                })

                return msg;
            },

            _baseStatusValidation(){
                var freePorts = this.freePorts();

                if (freePorts.length > 0){                    
                    freePorts.forEach(port=>{
                        this.get('errors').push({
                            code: 'PORT_NOT_CONNECTED',
                            cId: port.id,
                            msg: 'Port ['+port.id+'] is not connected'
                        })
                    })                    
                }                
            },

            _customValidation(){
                // Object.assign({}, A1);
                var portConnectionsCopy = Object.assign({}, this.get('_portConnections'));

                var blockData = {
                    id: this.id,
                    blockId: this.get('blockId'),
                    type: this.get('_type'),
                    configurables: Object.assign({},this.get('configurables')),
                    connections: portConnectionsCopy,
                    configurable: function (name) {
                    
                        var item = undefined;
                        Object.entries(this.configurables).forEach(entry=>{
                            if(entry[1].i == name)
                                item = entry[1].v;
                        })
                        return item;
                    },
                    connection: function (port) {
                    
                        var item = undefined;
                        Object.entries(this.connections).forEach(entry=>{
                            if(entry[1].port == port)
                                item = entry[1];
                        })
                        return item;
                    },
                    toArray: function(input){
                        var stringRepresentation = input || '[]';
                        var arrayObject = undefined;
                        try{
                            var arrayObject = JSON.parse(stringRepresentation);
                        }catch(e){
                        }
                        
                        return Array.isArray(arrayObject)?arrayObject:[];                
                    }
                }

                // var configurable = function (name) {
                    
                //     var item = undefined;
                //     return Object.entries(blockData.configurables).forEach(entry=>{
                //         if(entry[1].i == name)
                //             item = entry[1];
                //     })
                //     return item;
                // }
                // configurable.blockData = blockData;

                // var connection = function (port) {                                   
                //     var item = undefined;
                //     return Object.entries(blockData.connections).forEach(entry=>{
                //         if(entry[1].i == name)
                //             item = entry[1];
                //     })
                //     return item;
                // }
                // connection.blockData = blockData;

                if(this.get('_validationFunction')){
                    var errorsArray = this.get('_validationFunction').call(undefined, blockData);                    
                    errorsArray.forEach(error=>{
                        this.get('errors').push({
                            code: error.code,
                            cId: error.cId,
                            msg: error.msg
                        })
                    })
                }
            },

            // add helper functions
            

            
            /**
             * Revalidates block
             * One that wants to retrieve block status shall call getStatus().
             */
            _recalculateStatus() {
                // reset status
                this.set('errors',[]);
                this.set('status', 'OK');
                

                this._baseStatusValidation();
                this._customValidation();

                // console.log('Errors from validation ', this.get('blockId'), this.get('errors'));
                
                if(this.get('errors').length>0){
                    this.set('status', 'ERROR');
                    this.attr('.fb-validation-rect/fill', this.get('_style').validationERRORColor)
                } else {
                    this.set('errors',[])// reset errors array
                    this.set('status', 'OK');                    
                    this.attr('.fb-validation-rect/fill', this.get('_style').validationOKColor)
                }                

                // use validation function
                    
                // console.log(this.get('blockId'),  freePorts.length, this.get('status'));
            },

            _handleDelete(blockToBeDeleted) {
                var blockConnections = this.get('_portConnections').filter(block=>{
                    return block.id != blockToBeDeleted
                })
                this.set('_portConnections',blockConnections);
                this._recalculateStatus();
            },

            _handleDisconnect(block, port, linkId) {
                // console.log(this.get('blockId'),block.get('blockId'), port, linkId);
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

            _recalculateValidationRect: function (classSelectorPrefix, elementHeight, elementWidth, baseSize, positionY) {
                var attrs = this.get('attrs');
                // section height
                var partHeight = elementHeight * baseSize.height;                
                
                var positionX = (1.0-elementWidth) * baseSize.width;
                var partWidth = elementWidth * baseSize.width;                                
                this.attr(classSelectorPrefix + '-rect/height', partHeight);
                this.attr(classSelectorPrefix + '-rect/width', partWidth);                
                this.attr(classSelectorPrefix + '-rect/transform', 'translate('+positionX+',' + positionY + ')');
                // this.attr(classSelectorPrefix + '-rect/title', 'Block validation state: '+this.get('status'));                
                this.attr(classSelectorPrefix + '-rect/title', this._statusToString());                
                
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

            _enableRemoval(paper){
                var view = this.findView(paper);
                // console.log(view.getBBox().width, this.getBBox().width)
                // console.log(view.getBBox().width, this.getBBox().width)
                // var dx = view.getBBox().width-this.getBBox().width;
                var ports = this.getPorts();
                var hasIn = false;
                var hasOut = false;
                ports.forEach(port=>{
                    if(port.group == 'out')
                        hasOut = true;
                    if(port.group == 'in')
                        hasIn = true;
                })
        
                // if(hasIn&&hasOut){
                //     dx = -dx/2;    
                // }else if(hasOut){
                //     dx = -dx;
                // }else{
                //     dx=0
                // }
                var nx = '0%';
                if(hasIn&&hasOut)
                    nx = '70%'
                else if (hasOut)
                    nx = '62%'
                else   
                    nx = '100%'
                
                var removeButton = new joint.elementTools.Remove({
                    focusOpacity: 0.5,
                    rotate: true,
                    x: nx,
                    // y: '0%',
                    // offset: { x: dx, y: 0 }
                });
                
                var toolsView =  new joint.dia.ToolsView({
                    name: 'basic-tools',
                    tools: [removeButton]
                });
        
                
                
                view.addTools(toolsView);
                view.hideTools();
            },

            _recalculateTypeLabel: function(classSelectorPrefix, label, baseSize, positionY){
                var fontSize = baseSize.height*DEFAULTS.LABEL.FONT.SIZE;
                var fontX = 0;
                var fontY = positionY+fontSize;
                
                this.attr(classSelectorPrefix + '-text/font-size', fontSize);                
                this.attr(classSelectorPrefix + '-text/transform', 'translate(' + fontX + ',' + fontY + ')');                
                this.attr(classSelectorPrefix + '-text/text', label);
                this.attr(classSelectorPrefix + '-text/font-family', DEFAULTS.LABEL.FONT.FAMILY);    
                this.attr(classSelectorPrefix + '-text/font-weight', DEFAULTS.LABEL.FONT.WEIGHT);                    
            },

            _updateMyModel: function () {
                var self = this;
                var offsetY = 0;
                var field = {
                    width: this.get('size').width,
                    height: this.get('size').height,
                    icon: this.get('icon'),
                    name: this.get('debug') ? this.get('name') + '[' + this.get('blockId') + ']' : this.get('name'),
                    statusMessage: this.get('statusMsg'),
                    status: this.get('status'),
                    type: this.get('_type')
                }
                offsetY += self._recalculateRectWithLabel('.fb-label', field.name, 0.2, 0.6, field, offsetY);
                offsetY += self._recalculateRectWithIcon('.fb-icon', field.icon, 0.6, 0.8, field, offsetY);
                var previousOffsetY = offsetY;
                offsetY += self._recalculateRectWithLabel('.fb-status', field.statusMessage, 0.2, 0.3, field, offsetY);                
                self._recalculateValidationRect('.fb-validation', 0.2, 0.15, field, previousOffsetY);  
                self._recalculateTypeLabel('.fb-type-label',field.type, field, offsetY);              
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

    createBlank(blockId, typeName, template, statusDefinition, style, validation) {
        var factories = {
            PassThrough: this.createPassThroughElement,
            Start: this.createStartElement,
            Split: this.createSplitElement,
            Join: this.createJoinElement,
            End: this.createSinkElement,
            Mixer: this.createMixerElement
        }
        if (factories[template]) {
            var block = factories[template].call(this, '');
            // set id
            block.set('blockId',blockId);
            block.set('_type', typeName);
            block.applyValidation(validation);
            // apply style
            block.style(style);
            // calculate initial status of block 
            block._recalculateStatus();

            return block;
        } else {
            throw new Error('Unsuported template: ' + template);
        }
    }

    _createBaseOptions(){
        var options = {
            position: this.options.defaultPosition,
            size: this.options.defaultSize,
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

        return options;
    }


    /**
     * Element with a single input and a dual output
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createSplitElement(name) {
        var options = this._createBaseOptions();
        options.inPorts = ['in1']
        options.outPorts = ['out1', 'out2']
    
        var newBlock = new this.Model(options);                
        return newBlock;
    }

    /**
     * Element with a double input and a single output
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createJoinElement(name) {
        var options = this._createBaseOptions();
        options.inPorts = ['in1', 'in2'];
        options.outPorts = ['out1'];

        var newBlock = new this.Model(options);        
        return newBlock;
    }

    createMixerElement(name) {
        var options = this._createBaseOptions();
        options.inPorts = ['in1', 'in2'];
        options.outPorts = ['out1', 'out2'];

        var newBlock = new this.Model(options);        
        return newBlock;
    }

    /**
     * Element with a single input and a single output
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createPassThroughElement(name) {
        var options = this._createBaseOptions();
        options.inPorts = ['in1'];
        options.outPorts = ['out1'];

        var newBlock = new this.Model(options);
        return newBlock;
    }


    /**
     * Starting element
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createStartElement(name) {
        var options = this._createBaseOptions();        
        options.outPorts = ['out1'];

        var newBlock = new this.Model(options);
        return newBlock;
    }

    /**
     * Finish (sink) element
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createSinkElement(name) {
        var options = this._createBaseOptions();
        options.inPorts = ['in1'];
        
        var newBlock = new this.Model(options);
        return newBlock;
    }

    
}
module.exports = new Block({});