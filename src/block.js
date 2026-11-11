const jointjs = require("jointjs")
const DEFAULTS = require('./defaults')
const fromstring = require('from-string');

/**
 * Normalizes declarative validation rules so they can be serialized (RegExp objects are converted to source strings).
 * @param {*} rules 
 */
function normalizeRules(rules) {
    var normalized = {};
    if (rules.successors) {
        normalized.successors = JSON.parse(JSON.stringify(rules.successors));
    }
    if (Array.isArray(rules.required)) {
        normalized.required = rules.required.slice();
    }
    if (rules.patterns) {
        normalized.patterns = {};
        Object.keys(rules.patterns).forEach(fieldId => {
            var pattern = rules.patterns[fieldId];
            if (pattern instanceof RegExp) {
                normalized.patterns[fieldId] = { re: pattern.source, flags: pattern.flags };
            } else if (typeof pattern === 'string') {
                normalized.patterns[fieldId] = { re: pattern };
            } else if (pattern) {
                normalized.patterns[fieldId] = {
                    re: pattern.re instanceof RegExp ? pattern.re.source : pattern.re,
                    flags: pattern.re instanceof RegExp ? pattern.re.flags : pattern.flags,
                    msg: pattern.msg
                };
            }
        });
    }
    return normalized;
}

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
            _validationRules: undefined, // declarative validation rules {successors: {out1: {types: [], min, max}}, required: [fieldIds], patterns: {fieldId: {re, msg}}}, used when no validation function
            _configurablesDefinitions: [], // array of configurables definitions: (id:string, label: string, placeholder:string, type:string, required:boolean)
            _style: undefined,
            _defaultStyle: DEFAULTS.STYLE,
            _styles: DEFAULTS.STYLES,
            // stores number of ports of this element that are already connected
            _portsConnected: 0,
            // type of element
            _type: undefined,
            // template name used to create this element
            _template: undefined,
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
                // marker (i.e. breakpoint) in the left gutter of the block (.fb-marker) is NOT part of model attrs -
                // geometry and state are presentation only and are applied by the view (BlockView._fbLayoutMarker,
                // flow.setMarker), so diagrams saved with this version are identical to the ones saved by 1.3

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
                '<circle class="fb-marker" event="element:fb-marker:pointerdown"/>',
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
                    "element.set('icon', 'https://cdn.jsdelivr.net/npm/flowblocks-icons@1.0.8/i/vase.svg');",
                    "element.style({titleBarColor: '#FADB50'});",
                    "element.getStatus();",
                    "element.revalidate();",
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
             * Recalculates status of the block with its current validation (ports, required fields, declarative rules or
             * validation function) - e.g. a block of a diagram created outside the designer (stored status is not trusted).
             * @returns status of the block (see getStatus)
             */
            revalidate(){
                this._recalculateStatus();
                return this.getStatus();
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
             * Sets declarative validation rules (used when block has no validation function).
             * Rules are plain data so they are serialized together with the block.
             * @param {*} rules {successors: {portId: {types: [type names], min, max}}, required: [field ids], patterns: {fieldId: {re: string|RegExp, msg}}}
             */
            applyValidationRules(rules){
                if(!rules) return;
                this.set('_validationRules', normalizeRules(rules));
            },
            /**
             * Used during import, reinstantiates and binds custom validation 
             * functions to blocks
             */
            _reApplyValidation(validationFunctionFromTypes, validationRulesFromTypes){
                if(validationFunctionFromTypes){
                    this.set('_validationFunction', validationFunctionFromTypes);
                    return;
                }
                // declarative validation - no function is instantiated from source code (no new Function)
                if(validationRulesFromTypes){
                    this.applyValidationRules(validationRulesFromTypes);
                    return;
                }
                if(this.get('_validationRules') && !this.get('_validationSource')){
                    return;
                }
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

            /**
             * Style definition used for the validation state colors. Cells saved without _style (i.e. diagrams generated
             * outside of the editor) fall back to the default style definition - nothing is written to the model.
             */
            _statusStyle(){
                var current = this.get('_style');
                if(current && typeof current === 'object') return current;
                var styles = this.get('_styles') || {};
                var defaultName = String(this.get('_defaultStyle') || DEFAULTS.STYLE).toLocaleLowerCase();
                var builtIn = DEFAULTS.STYLES || {};
                return styles[defaultName] || builtIn[defaultName] || builtIn[String(DEFAULTS.STYLE).toLocaleLowerCase()] || {};
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
            
            /**
             * Resets block configurables values.
             * Validation is applied to check if all configurables meet validation criteria.
             * @param {*} configurables Array of configurables values {i: name/id of the configurable, v: values (string)}             
             */
            setConfigurables(configurables){
                // FB-17: a NUMBER configurable marked `outPorts: true` sets the number of outputs (e.g. Parallel branches) -
                // applied first, so a refused change (connected output) leaves the block unchanged
                var portsDef = (this.get('_configurablesDefinitions') || []).find(d => d && d.outPorts === true);
                if (portsDef) {
                    var item = (configurables || []).find(c => c && c.i == portsDef.id);
                    var n = item && item.v !== undefined && item.v !== null && item.v !== '' ? Number(item.v) : Number(portsDef.default);
                    if (Number.isInteger(n) && n >= 1) this.setOutPorts(n);
                }
                this.set('configurables', configurables);
                // treat name in a special way - block name is populated from the name configurable
                const name = this.getConfigurable("name")
                this.set("name", name);
                // redraw and recalculate status
                this._recalculateStatus();
            },   

            /**
             * Sets block configurable to given value. If necessary updates existing value.
             * @param {*} name name/id of the configurable
             * @param {*} value value to be set
             */
            setConfigurable(name, value){
                var configurable = this.getConfigurable(name);
                if(configurable){
                    var configurables = this.get('configurables');
                    configurables.forEach(item=>{
                        if(item.i == name){
                            item.v = value
                        }
                    })
                    this.setConfigurables(configurables);
                }else{
                    
                    // also add default configurablesDefinition
                    this.addConfigurableDefinition({
                        id: name, 
                        label: name, 
                        placeholder:"",
                        type: 'TEXT', 
                        required: true
                    })                    

                    // no configurable found, adding new
                    var configurables = this.get('configurables');
                    configurables.push({
                        i: name,
                        v: value
                    })
                    this.setConfigurables(configurables);                    
                }                
            },

            /**
             * Adds or replaces configurable definition entry for given definition.id             
             * @param {*} definition configurable definition (id:string, label: string, placeholder:string, type:string, required:boolean)
             */
            addConfigurableDefinition(definition){
                const configurablesDefinitions = this.get("_configurablesDefinitions");

                //(id:string, label: string, placeholder:string, type:string, required:boolean)
                const configurableConfiguration = configurablesDefinitions.find((item)=>{return item.id == definition.id})
                if(configurableConfiguration){
                    // entry exists so replace 
                    configurablesDefinitions.map((item)=>{
                        return item.id == definition.id?definition:item;
                    })
                }else{
                    configurablesDefinitions.push(definition);
                }
                this.set("_configurablesDefinitions", configurablesDefinitions);
            },

            /**
             * FB-17: height of the block for its ports - more than PORTS_FIXED ports in a group (in / out) makes the block
             * taller, so ports keep at least PORT_SPACING px of spacing (port circles and labels do not overlap).
             * @returns {number} required height
             */
            requiredHeight() {
                var count = { in: 0, out: 0 };
                this.getPorts().forEach(p => { if (count[p.group] !== undefined) count[p.group]++; });
                var n = Math.max(count.in, count.out);
                var base = DEFAULTS.SIZE.height;
                return n > DEFAULTS.PORTS_FIXED ? Math.max(base, DEFAULTS.PORT_SPACING * (n + 1)) : base;
            },

            /**
             * FB-17: adjusts the height of the block to its ports (width unchanged). A block is made taller when its ports
             * need it; it is made lower only with `shrink` (ports removed by setOutPorts) - diagrams with blocks resized
             * on purpose keep their size on import.
             * @param {boolean} [shrink] @returns {boolean} changed
             */
            fitPortsHeight(shrink) {
                var size = this.get('size') || {};
                var h = this.requiredHeight();
                if (h === size.height || (h < size.height && !shrink)) return false;
                this.resize(size.width || DEFAULTS.SIZE.width, h);
                return true;
            },

            /**
             * FB-17: number of output ports of a split block (out1..outN, 1..MAX_OUT_PORTS) - e.g. Parallel with N branches.
             * Connections of the remaining ports are kept; removing a connected port is refused.
             * @param {number} n
             * @throws {Error} code PORT_CONNECTED (with ports) / PORT_COUNT
             */
            setOutPorts(n) {
                n = Number(n);
                if (!Number.isInteger(n) || n < 1 || n > DEFAULTS.MAX_OUT_PORTS) {
                    var e = new Error('Number of outputs must be 1..' + DEFAULTS.MAX_OUT_PORTS); e.code = 'PORT_COUNT'; throw e;
                }
                var next = [];
                for (var i = 1; i <= n; i++) next.push('out' + i);
                var current = this.get('outPorts') || [];
                var removed = current.filter(p => next.indexOf(p) < 0);
                var busy = (this.get('_portConnections') || []).filter(c => removed.indexOf(c.port) >= 0).map(c => c.port);
                if (busy.length) {
                    var err = new Error('Connected outputs can not be removed: ' + busy.join(', ')); err.code = 'PORT_CONNECTED'; err.ports = busy; throw err;
                }
                if (current.length === n && current.every((p, k) => p === next[k])) return false;
                this.set('outPorts', next);
                var tpl = this.get('_template');
                if (/^Split\d?$/.test(tpl || '') && (this.get('inPorts') || []).length === 1) this.set('_template', n === 2 ? 'Split' : 'Split' + n);
                this.fitPortsHeight(true);
                this._recalculateStatus();
                return true;
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

            /**
             * Validates if all ports are connected
             */
            _basePortsValidation(){
                var freePorts = this.freePorts();
                // declarative rules may mark port as optional (successors.<port>.min == 0)
                var rules = this.get('_validationFunction') ? undefined : this.get('_validationRules');
                if (rules && rules.successors) {
                    freePorts = freePorts.filter(port=>{
                        var successorRule = rules.successors[port.id];
                        return !(successorRule && successorRule.min === 0);
                    });
                }

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
            /**
             * Validates if all required configurables are set
             */
            _baseConfigurablesValidation(){
                var self = this;
                this.get('_configurablesDefinitions').filter(item=>{
                    return item.required;
                }).forEach(requiredItem=>{
                    var actualConfigurable = self.getConfigurable(requiredItem.id);
                    if(!actualConfigurable){
                        this.get('errors').push({
                            code: 'FIELD_REQUIRED',
                            cId: requiredItem.id,
                            msg: 'Field ['+requiredItem.id+'] is required'
                        })
                    }
                })
            },

            _baseStatusValidation(){
                this._basePortsValidation();   
                this._baseConfigurablesValidation();                
            },
            /**
             * Reads block configurable with given name and returns it in its proper data type
             * @param {*} name Name of the configurable to be returned
             * @returns Configurable value (casted to the type) or undefined when no such configurable found
             */
            getConfigurable(name){
                var item = undefined;                
                Object.entries(this.get('configurables')).forEach(entry=>{
                    if(entry[1].i == name)
                        item = entry[1].v;
                })
                return fromstring.parse(item);
            },

            _customValidation(){
                var self = this;
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
                        return fromstring.parse(item);
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
                            var arrayObject = fromstring.parse(stringRepresentation);
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
                    // todo if new types definition is provided use the new definition for validation instead of the saved one
                    var errorsArray = this.get('_validationFunction').call(self, blockData);                    
                    errorsArray.forEach(error=>{
                        this.get('errors').push({
                            code: error.code,
                            cId: error.cId,
                            msg: error.msg
                        })
                    })
                } else if(this.get('_validationRules')){
                    this._declarativeValidation(this.get('_validationRules'));
                }
            },

            /**
             * Declarative validation (FB-09c) - evaluated when block has no validation function.
             * Error codes: SUCCESSOR_MIN, SUCCESSOR_MAX, SUCCESSOR_TYPE, FIELD_REQUIRED, FIELD_PATTERN
             * @param {*} rules normalized rules (see applyValidationRules)
             */
            _declarativeValidation(rules){
                var self = this;
                var errors = this.get('errors');
                var connections = this.get('_portConnections') || [];
                if (rules.successors) {
                    Object.keys(rules.successors).forEach(portId=>{
                        var rule = rules.successors[portId] || {};
                        var portConnections = connections.filter(connection=>connection.port == portId);
                        if (rule.min !== undefined && rule.min !== null && portConnections.length < rule.min && rule.min > 0) {
                            // not connected ports are already reported by base ports validation
                            var reported = errors.find(error=>error.code == 'PORT_NOT_CONNECTED' && error.cId == portId);
                            if (!reported) {
                                errors.push({ code: 'SUCCESSOR_MIN', cId: portId, msg: 'Port ['+portId+'] requires at least '+rule.min+' connection(s)' });
                            }
                        }
                        if (rule.max !== undefined && rule.max !== null && portConnections.length > rule.max) {
                            errors.push({ code: 'SUCCESSOR_MAX', cId: portId, msg: 'Port ['+portId+'] allows at most '+rule.max+' connection(s)' });
                        }
                        if (Array.isArray(rule.types) && rule.types.length > 0) {
                            portConnections.forEach(connection=>{
                                if (rule.types.indexOf(connection.type) == -1) {
                                    errors.push({ code: 'SUCCESSOR_TYPE', cId: portId, msg: 'Port ['+portId+'] can not be connected to block of type ['+connection.type+'], allowed: '+rule.types.join(', ') });
                                }
                            });
                        }
                    });
                }
                var rawValue = function(fieldId){
                    var configurable = (self.get('configurables') || []).find(item=>item.i == fieldId);
                    return configurable ? configurable.v : undefined;
                };
                var isEmpty = function(value){
                    return value === undefined || value === null || (typeof value === 'string' && (value.trim() === '' || value === 'undefined'));
                };
                if (Array.isArray(rules.required)) {
                    rules.required.forEach(fieldId=>{
                        if (isEmpty(rawValue(fieldId))) {
                            var reported = errors.find(error=>error.code == 'FIELD_REQUIRED' && error.cId == fieldId);
                            if (!reported) {
                                errors.push({ code: 'FIELD_REQUIRED', cId: fieldId, msg: 'Field ['+fieldId+'] is required' });
                            }
                        }
                    });
                }
                if (rules.patterns) {
                    Object.keys(rules.patterns).forEach(fieldId=>{
                        var pattern = rules.patterns[fieldId];
                        var value = rawValue(fieldId);
                        if (!pattern || isEmpty(value)) return;
                        var re;
                        try {
                            re = new RegExp(pattern.re, pattern.flags || '');
                        } catch (e) {
                            console.warn('Invalid validation pattern for field '+fieldId, e);
                            return;
                        }
                        if (!re.test(String(value))) {
                            errors.push({ code: 'FIELD_PATTERN', cId: fieldId, msg: pattern.msg ? pattern.msg : 'Field ['+fieldId+'] has invalid format' });
                        }
                    });
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
                this.set('statusMsg', 'OK');

                this._baseStatusValidation();
                this._customValidation();

                // console.log('Errors from validation ', this.get('blockId'), this.get('errors'));
                
                var statusStyle = this._statusStyle();
                if(this.get('errors').length>0){
                    this.set('status', 'ERROR');
                    this.attr('.fb-validation-rect/fill', statusStyle.validationERRORColor)
                    this.set('statusMsg', 'INVALID');
                } else {
                    this.set('errors',[])// reset errors array
                    this.set('status', 'OK');                    
                    this.attr('.fb-validation-rect/fill', statusStyle.validationOKColor)
                    this.set('statusMsg', 'OK');
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
                var size = this.get('size');
                // FB-17: a block taller than wide (many ports) keeps the proportions of a square block - title bar, status
                // bar, fonts and icon are sized to the width, the icon section takes the remaining height
                var unit = size.height > size.width ? size.width : size.height;
                var iconPart = size.height - 0.4 * unit;
                var field = {
                    width: size.width,
                    height: unit,
                    icon: this.get('icon'),
                    name: this.get('debug') ? this.get('name') + '[' + this.get('blockId') + ']' : this.get('name'),
                    statusMessage: this.get('statusMsg'),
                    status: this.get('status'),
                    type: this.get('_type')
                }
                offsetY += self._recalculateRectWithLabel('.fb-label', field.name, 0.2, 0.6, field, offsetY);
                // square block - the same arithmetic as 1.4 (saved diagrams identical); tall block - icon section stretched
                offsetY += size.height > size.width
                    ? self._recalculateRectWithIcon('.fb-icon', field.icon, iconPart / unit, 0.48 * unit / iconPart, field, offsetY)
                    : self._recalculateRectWithIcon('.fb-icon', field.icon, 0.6, 0.8, field, offsetY);
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
                    this._fbLayoutMarker();
                    this._fbDecorate();
                });
            },

            render: function () {
                jointjs.dia.ElementView.prototype.render.apply(this, arguments);
                this._fbRendered = true;
                this._fbLayoutMarker();
                this._fbDecorate();
                return this;
            },

            /** FB-16: attribute updates (e.g. name, style) re-apply the presentation (shortened title, port labels). */
            update: function () {
                var r = jointjs.dia.ElementView.prototype.update.apply(this, arguments);
                if (this._fbRendered) this._fbDecorate();
                return r;
            },

            /**
             * Layout of the marker - left gutter of the block, vertically centered on the label bar (in ports are
             * presented in the middle of the left edge). Applied to the DOM only (never to model attrs - not serialized).
             */
            _fbLayoutMarker: function () {
                var el = this.el && this.el.querySelector ? this.el.querySelector('.fb-marker') : undefined;
                var size = this.model.get('size');
                if (!el || !size) return;
                var r = Math.max(4, Math.round(Math.min(size.width, size.height) * 0.07));
                el.setAttribute('r', r);
                el.setAttribute('cx', -(r + 4));
                el.setAttribute('cy', (0.2 * size.height) / 2);
            },

            /**
             * Applies presentation only decorations (test ids, markers, highlights) provided by the flow
             */
            _fbDecorate: function () {
                if (this.paper && typeof this.paper.fbDecorateView === 'function') {
                    this.paper.fbDecorateView(this);
                }
            }
        });
        this.View = jointjs.shapes.flowblocks.BlockView;
    }

    createBlank(blockId, typeName, template, statusDefinition, style, validation, configurablesDefinitionArray, validationRules) {
        var factories = {
            PassThrough: this.createPassThroughElement,
            Start: this.createStartElement,
            Split: this.createSplitElement,
            Split3: this.createSplit3Element,
            Split4: this.createSplit4Element,
            Split5: this.createSplit5Element,
            Split6: function () { return this.createSplitNElement(6); },
            Split7: function () { return this.createSplitNElement(7); },
            Split8: function () { return this.createSplitNElement(8); },
            Join: this.createJoinElement,
            End: this.createSinkElement,
            Mixer: this.createMixerElement
        }
        if (factories[template]) {
            var block = factories[template].call(this, '');
            // set id
            block.set('blockId',blockId);
            block.set('_type', typeName);
            block.set('_template', template);
            block.set('_configurablesDefinitions', configurablesDefinitionArray);
            block.applyValidation(validation);
            // declarative validation is used only when there is no validation function
            if (!validation && validationRules)
                block.applyValidationRules(validationRules);
            // apply style
            block.style(style);
            // FB-17: blocks with many ports are taller
            block.fitPortsHeight();
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

    createSplit3Element(name) {
        var options = this._createBaseOptions();
        options.inPorts = ['in1']
        options.outPorts = ['out1', 'out2', 'out3']
    
        var newBlock = new this.Model(options);                
        return newBlock;
    }

    createSplit4Element(name) {
        var options = this._createBaseOptions();
        options.inPorts = ['in1']
        options.outPorts = ['out1', 'out2', 'out3', 'out4']
    
        var newBlock = new this.Model(options);                
        return newBlock;
    }

    createSplit5Element(name) {
        var options = this._createBaseOptions();
        options.inPorts = ['in1']
        options.outPorts = ['out1', 'out2', 'out3', 'out4', 'out5']
    
        var newBlock = new this.Model(options);                
        return newBlock;
    }

    /**
     * FB-17: element with a single input and N outputs (2..MAX_OUT_PORTS) - templates Split6..Split8 (Split..Split5 kept)
     * @param {number} n
     */
    createSplitNElement(n) {
        var options = this._createBaseOptions();
        options.inPorts = ['in1'];
        options.outPorts = [];
        for (var i = 1; i <= n; i++) options.outPorts.push('out' + i);
        return new this.Model(options);
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