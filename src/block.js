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
    
    _initialize(){   
        jointjs.shapes.flowblocks = {};

        this.Model = jointjs.shapes.devs.Model.define('flowblocks.Block',{
            // now model fields
            name: '',            
            icon: './resources/img/svg/agave.svg',
            status: 'OK', // OK, ERROR,
            statusMsg: 'OK',

            // now presentation fields
            attrs: {
                rect: { 'ref-width': '100%',
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

                '.fb-icon-rect' : {                    
                    'fill': 'rgb(219, 233, 251)'
                    
                } ,
                '.fb-icon-image': {
                    'ref': '.fb-icon-rect'
                },

                '.fb-status-rect': {                  
                    'fill': 'rgb(209, 226, 208)'                    

                },
                '.fb-status-text' : {        
                    'ref': '.fb-status-rect',
                    // 'ref-x': 10,
                    // 'ref-y': 10,    
                    // 'font-size': '0.5rem',
                    'text-anchor': 'start',        
                    'fill': 'black' ,
                    'y-alignment': 'middle'               
                } ,

                '.fb-label-rect': { 
                    'fill': 'rgb(255, 230, 206)'                    
                },
                '.fb-label-text' : {   
                    'ref': '.fb-label-rect',
                    // 'ref-x': 10,
                    // 'ref-y': 10,    
                    // 'font-size': '0.75rem',
                    'text-anchor': 'start',        
                    'fill': 'black' ,
                    'y-alignment': 'middle'               
                }
                
                // label: {
                //     fill: '#ffa500'
                // }

            }
            // defaults - object that contains properties to be assigned to every constructed instance of the subtype. 
            // Used for specifying default attributes.
        },{
            // proto props - object that contains properties to be assigned on the subtype prototype. 
            // Intended for properties intrinsic to the subtype, not usually modified. Used for specifying shape markup.
            markup: [
                // '<g class="rotatable">',
                // '<g class="scalable">',
                // '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect"/><rect class="uml-class-methods-rect"/>',
                // '</g>',
                // '<text class="uml-class-name-text"/><text class="uml-class-attrs-text"/><text class="uml-class-methods-text"/>',
                // '</g>',
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
            
            initialize: function() {
                this.on('change:name change:icon change:status change:statusMsg change:size', function() {
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

            api: function(){
                var api = [
                    "element.set('name','my label');",
                    "element.set('position', {x:30, y:10});",
                    "element.set('size', {width:50, height: 50});",
                    "element.set('icon', '//resources/img/svg/vase.svg');"
                ];
                return api;
            },

            _recalculateRectWithLabel: function(classSelectorPrefix, label, elementHeight, fontSize, baseSize, positionY){        
                var attrs = this.get('attrs');
                // section height
                var partHeight = elementHeight * baseSize.height;
                
                var partFontSize = fontSize * partHeight;
                var fontY = positionY + partHeight / 2;
                var fontX = 0.1 * baseSize.width;

                this.attr(classSelectorPrefix+'-rect/height', partHeight);
                // attrs[classSelectorPrefix+'-rect'].height = partHeight;
                this.attr(classSelectorPrefix+'-rect/transform', 'translate(0,' + positionY + ')');
                // attrs[classSelectorPrefix+'-rect'].transform = 'translate(0,' + positionY + ')';

                this.attr(classSelectorPrefix+'-text/font-size', partFontSize);
                // attrs[classSelectorPrefix+'-text']['font-size'] = partFontSize;
                this.attr(classSelectorPrefix+'-text/transform', 'translate(' + fontX + ',' + fontY + ')');
                // attrs[classSelectorPrefix+'-text'].transform = 'translate(' + fontX + ',' + fontY + ')';                
                this.attr(classSelectorPrefix+'-text/text',label);                
                             
                return partHeight;
            },

            _recalculateRectWithIcon: function(classSelectorPrefix, iconHref, elementHeight, iconSize, baseSize, positionY){                        
                var partHeight = elementHeight*baseSize.height;

                this.attr(classSelectorPrefix+'-rect/height', partHeight);            
                this.attr(classSelectorPrefix+'-rect/transform', 'translate(0,' + positionY + ')');
                
                var iconHeight = iconSize * partHeight;
                var iconX = baseSize.width / 2 - iconHeight / 2;
                var iconY = positionY + partHeight / 2 - iconHeight / 2;

                this.attr(classSelectorPrefix+'-image/height', iconHeight);                
                this.attr(classSelectorPrefix+'-image/transform', 'translate(' + iconX + ',' + iconY + ')');                
                this.attr(classSelectorPrefix+'-image/href', iconHref);                                
                             
                return partHeight;
            },
            
            _updateMyModel: function(){                
                var self = this;            
                var offsetY = 0;
                var field = {
                        width: this.get('size').width,
                        height: this.get('size').height,
                        icon: this.get('icon'), 
                        name: this.get('name'),
                        statusMessage: this.get('statusMsg')
                }                
                offsetY += self._recalculateRectWithLabel('.fb-label', field.name, 0.2, 0.6, field, offsetY);
                offsetY += self._recalculateRectWithIcon('.fb-icon', field.icon, 0.6, 0.8, field, offsetY);
                offsetY += self._recalculateRectWithLabel('.fb-status', field.statusMessage, 0.2, 0.3, field, offsetY);                                
            }
        },{
            // static props - object that contains properties to be assigned on the subtype constructor. 
            // Not very common, used mostly for alternative constructor functions.
        })

        
        jointjs.shapes.flowblocks.BlockView = jointjs.dia.ElementView.extend({

            initialize: function() {
    
                jointjs.dia.ElementView.prototype.initialize.apply(this, arguments);
    
                this.listenTo(this.model, 'flowblocks-block-update', function() {
                    this.update();
                    this.resize();
                });
            }
        });
        this.View = jointjs.shapes.flowblocks.BlockView;
    }

    createBlankElement(template, statusDefinition){
        var factories = {
            PassThrough: this.createPassThroughElement,
            Start: this.createStartElement,
            Split: this.createSplitElement,
            Join: this.createJoinElement,
            End: this.createSinkElement
        }        
        if(factories[template]){
            return factories[template].call(this, '', statusDefinition);
        }else{
            throw new Error('Unsuported template: '+template);
        }        
    }


    /**
     * Element with a single input and a dual output
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createSplitElement(name, statusDefinition){
        var options = {
            position: { x: 40, y: 20 },
            size: this.options.defaultSize,
            inPorts: ['in'],
            outPorts: ['out1','out2'],
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
     * Element with a double input and a single output
     * @param {*} name 
     * @param {*} statusDefinition 
     */
    createJoinElement(name, statusDefinition){
        var options = {
            position: { x: 40, y: 20 },
            size: this.options.defaultSize,
            inPorts: ['in1','in2'],
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
    createPassThroughElement(name, statusDefinition){
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
    createStartElement(name, statusDefinition){
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
    createSinkElement(name, statusDefinition){
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
            },rs: {
                '.label': { text: 'Model', 'ref-x': .5, 'ref-y': .2 },
                rect: { fill: '#2ECC71' }
            }
        }
        var newBlock = new this.Model(options);        
        return newBlock;
    }
}
module.exports = new Block({});

// export const Model = Generic.define('devs.Model', 
// {
//     inPorts: [],
//     outPorts: [],
//     size: {
//         width: 80,
//         height: 80
//     },
//     attrs: {
//         '.': {
//             magnet: false
//         },
//         '.label': {
//             text: 'Model',
//             'ref-x': .5,
//             'ref-y': 10,
//             'font-size': 18,
//             'text-anchor': 'middle',
//             fill: '#000'
//         },
//         '.body': {
//             'ref-width': '100%',
//             'ref-height': '100%',
//             stroke: '#000'
//         }
//     },
//     ports: {
//         groups: {
//             'in': {
//                 position: {
//                     name: 'left'
//                 },
//                 attrs: {
//                     '.port-label': {
//                         fill: '#000'
//                     },
//                     '.port-body': {
//                         fill: '#fff',
//                         stroke: '#000',
//                         r: 10,
//                         magnet: true
//                     }
//                 },
//                 label: {
//                     position: {
//                         name: 'left',
//                         args: {
//                             y: 10
//                         }
//                     }
//                 }
//             },
//             'out': {
//                 position: {
//                     name: 'right'
//                 },
//                 attrs: {
//                     '.port-label': {
//                         fill: '#000'
//                     },
//                     '.port-body': {
//                         fill: '#fff',
//                         stroke: '#000',
//                         r: 10,
//                         magnet: true
//                     }
//                 },
//                 label: {
//                     position: {
//                         name: 'right',
//                         args: {
//                             y: 10
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }, 
// {
//     markup: '<g class="rotatable"><rect class="body"/><text class="label"/></g>',
//     portMarkup: '<circle class="port-body"/>',
//     portLabelMarkup: '<text class="port-label"/>',

//     initialize: function() {

//         Generic.prototype.initialize.apply(this, arguments);

//         this.on('change:inPorts change:outPorts', this.updatePortItems, this);
//         this.updatePortItems();
//     },

//     updatePortItems: function(model, changed, opt) {

//         // Make sure all ports are unique.
//         var inPorts = uniq(this.get('inPorts'));
//         var outPorts = difference(uniq(this.get('outPorts')), inPorts);

//         var inPortItems = this.createPortItems('in', inPorts);
//         var outPortItems = this.createPortItems('out', outPorts);

//         this.prop('ports/items', inPortItems.concat(outPortItems), assign({ rewrite: true }, opt));
//     },

//     createPortItem: function(group, port) {

//         return {
//             id: port,
//             group: group,
//             attrs: {
//                 '.port-label': {
//                     text: port
//                 }
//             }
//         };
//     },

//     createPortItems: function(group, ports) {

//         return toArray(ports).map(this.createPortItem.bind(this, group));
//     },

//     _addGroupPort: function(port, group, opt) {

//         var ports = this.get(group);
//         return this.set(group, Array.isArray(ports) ? ports.concat(port) : [port], opt);
//     },

//     addOutPort: function(port, opt) {

//         return this._addGroupPort(port, 'outPorts', opt);
//     },

//     addInPort: function(port, opt) {

//         return this._addGroupPort(port, 'inPorts', opt);
//     },

//     _removeGroupPort: function(port, group, opt) {

//         return this.set(group, without(this.get(group), port), opt);
//     },

//     removeOutPort: function(port, opt) {

//         return this._removeGroupPort(port, 'outPorts', opt);
//     },

//     removeInPort: function(port, opt) {

//         return this._removeGroupPort(port, 'inPorts', opt);
//     },

//     _changeGroup: function(group, properties, opt) {

//         return this.prop('ports/groups/' + group, isObject(properties) ? properties : {}, opt);
//     },

//     changeInGroup: function(properties, opt) {

//         return this._changeGroup('in', properties, opt);
//     },

//     changeOutGroup: function(properties, opt) {

//         return this._changeGroup('out', properties, opt);
//     }
// });