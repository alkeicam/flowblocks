const jointjs = require("jointjs")
const helper = require('./helper')
const EVENTS_DICT = require('./events-dict')
const shortid = require('shortid');
const STYLES = require('./styles');

/**
 * Highlight states supported by highlight() (FB-07). Each state is presented by CSS class fb-hl-<state>
 */
const HIGHLIGHT_STATES = ['ok', 'error', 'timeout', 'current', 'visited', 'added', 'removed', 'changed'];
/**
 * Marker kinds supported by setMarker() (FB-08). Each kind is presented by CSS class fb-marker-<kind>
 */
const MARKER_KINDS = ['breakpoint', 'breakpoint-cond', 'breakpoint-disabled'];
/**
 * Debounce time of the flowblocks:diagram-changed event (FB-01)
 */
const DIAGRAM_CHANGED_DEBOUNCE_MS = 150;

class Flow {
    constructor(options) {
        this.options = {
        };
        this.graph = {};
        this.paper = {};
        this._blocks = [];
        Object.assign(this.options, options);
        this._initialize();
        this.emitter = undefined;
        this._resetState();
    }

    /**
     * Resets modeler tools state (dirty flag, highlights, markers, diff overlay, read only)
     */
    _resetState(){
        this._dirty = false;
        this._muted = 0;
        this._changesPending = 0;
        if(this._changeTimer) clearTimeout(this._changeTimer);
        this._changeTimer = undefined;
        this._readOnly = false;
        this._highlights = {};  // id (blockId or cell id) -> {state, link: boolean}
        this._markers = {};     // blockId -> {kind, tooltip}
        this._diff = { highlighted: [], ghosts: [] };
        this._testIdPrefix = this._testIdPrefix || 'flowblocks';
    }

    _initialize() {
    }

    create(paperDivId, emitter, name, bId) {
        var self = this;
        this._resetState();
        // new graph - blocks of the previous graph (if any) are no longer valid
        this._blocks = [];
        this.emitter = emitter;
        this.graph = new jointjs.dia.Graph;
        STYLES.inject();
        this.paper = new jointjs.dia.Paper({

            el: document.getElementById(paperDivId),
            width: 1400,
            height: 960,
            gridSize: 1,
            model: self.graph,
            // background: {
            //     color: '#F2EAD7'
            // },
            snapLinks: true,
            linkPinning: false,
            embeddingMode: true,
            clickThreshold: 5,
            // read only mode and ghost (diff overlay) cells are not interactive (FB-04, FB-10)
            interactive: function(cellView){
                return self._isInteractive(cellView);
            },
            defaultLink: new jointjs.dia.Link({
                attrs: {
                    '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
                    '.connection': { stroke: 'blue' },
                    '.marker-source': { d: 'M 15 0 L 0 5 L 15 15 z', opacity: '0', stroke: 'orange' },
                    '.marker-arrowhead[end="source"]': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z', opacity: '0' }
                },
                router: { name: 'metro' },
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
                var freeInPorts = targetElement.freePorts('in');                
                var freePort = freeInPorts.find(port=>{
                    return port.id == magnetT.getAttribute('port');
                })
                var portIsFree = freePort ? true : false;
                
                return magnetS != magnetT && magnetT.getAttribute('port-group') == 'in' && cellViewS != cellViewT && portIsFree;
            },
            validateMagnet: function (cellView, magnet, evt) {
                // no new connections in read only mode and from ghost cells
                if (self._readOnly || cellView.model.get('ghost')) {
                    return false;
                }
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
        
        var graphId = bId ? bId : shortid.generate();
        var graphName = name ? name : 'Flowblocks #'+graphId;
        this.graph.set('name', graphName);
        this.graph.set('id', graphId);
        this.graph.set('created', Date.now());
        // block views call this hook after rendering so presentation only decorations
        // (test ids, markers, highlights, ghost look) are applied outside of the model (not serialized)
        this.paper.fbDecorateView = function(view){
            self._decorateView(view);
        };
        
        this._bindConnectionEvents();
        this._bindToolsEvents();   
        this._bindInteractionEvents();   
        this._bindChangeEvents();
        
        this.emitter.emit(EVENTS_DICT.EVENTS.FLOWBLOCKS_CREATE_SUCCESS, this.graph.get('name'), this.graph.get('id'), this.graph.get('version'));
        return this;
    }

    removeAllBlocks(){
        this.graph.removeCells(this._blocks);
        this._blocks = [];
    }

    /**
     * Traverser current model specification that is presented in Flowblocks
     * Assumes linear/sequential graph.
     * @returns {Array} Array of {p: previous, c: current, n: next} objects holding blocks
     */
    //(previousBlock, currentBlock, nextBlock)
    traverseSequential(){
        var result = []; // {p: previous, c: current, n: next}
        // find start block
        var inputBlock = undefined;
        inputBlock = this._blocks.find(block=>{
            return block.get('_template') == 'Start';
        })

        if(!inputBlock){
            return;
            console.warn('No input block found.');
        }

        // traverse graph
        var blocks = []; 

        this.graph.bfs(inputBlock, function(block){
            blocks.push(block)
        })

        // build result object
        for(var i=0; i<blocks.length;i++){
            var pIdx = i-1>=0?i-1:i;
            var nIdx = i+1<blocks.length?i+1:i;
            
            var previous = blocks[pIdx];
            var current = blocks[i];   
            var next = blocks[nIdx];
            result.push({
                p: previous.get('blockId') != current.get('blockId')?previous:undefined,
                c: current,
                n: next.get('blockId') != current.get('blockId')?next:undefined
            })
        }
        return result;
    }

    /**
     * Imports flowblocks graph
     * When ty
     * @param {*} graphJson 
     * @param {Object} types - when provided, each cell validation will be first searched in types definition, when not found validation from cell itself
     * will be used 
     */
    import(graphJson, typesForValidation /* object holding each type */){
        // diagram changes during import are not reported (FB-01)
        this._muted++;
        try{
            // diff overlay is bound to the previous diagram
            this._diff = { highlighted: [], ghosts: [] };
            this.removeAllBlocks();
            this.graph.fromJSON(graphJson);
            // now build _blocks array
            var cells = this.graph.getCells();
            cells.forEach(cell=>{
                if(cell.isElement()){
                    // reinstantiate custom validation functions
                    // here goes the change - validation will be reapplied from types provided instead of validation sitting already on block/cell
                    const typeName = cell.get("_type");
                    const typeDefinition = typesForValidation&&typesForValidation[typeName] ? typesForValidation[typeName] : undefined;
                    cell._reApplyValidation(typeDefinition&&typeDefinition.validation?typeDefinition.validation:undefined, typeDefinition&&typeDefinition.rules?typeDefinition.rules:undefined);
                    this.addBlock(cell, true);
                    // reinitialize custom validations
                }                
            })
        }finally{
            this._muted--;
        }
        // freshly imported diagram is clean
        this.markClean();
        // highlights survive import (FB-07), markers are re-applied when block views are rendered
        this._reapplyHighlights();
        this.emitter.emit(EVENTS_DICT.EVENTS.FLOWBLOCKS_IMPORT_SUCCESS, this.graph.get('name'), this.graph.get('id'), this.graph.get('version'));
        this.emitter.emit(EVENTS_DICT.EVENTS.FLOWBLOCKS_DONE_SUCCESS);
    }

    _bindInteractionEvents(){
        var self = this;
        this.paper.on('element:pointerdblclick', function (toolView, evt) {   
            // ghost cells (diff overlay) can not be configured
            if (toolView.model.get('ghost')) return;
            self.emitter.emit(EVENTS_DICT.EVENTS.BLOCK_DBLCLICK, toolView.model, evt)                        
        });
        // block marker (left gutter) clicked (FB-08)
        this.paper.on('element:fb-marker:pointerdown', function (view, evt) {
            if (view.model.get('ghost')) return;
            if (evt && evt.stopPropagation) evt.stopPropagation();
            self.emitter.emit(EVENTS_DICT.EVENTS.BLOCK_MARKER_CLICK, view.model.get('blockId'), view.model, evt);
        });
    }

    _bindToolsEvents() {
        var self = this;
        this.paper.on('element:mouseenter', function (view) {
            // no Remove tool in read only mode (FB-04)
            if (self._readOnly || view.model.get('ghost')) return;
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

            self.emitter.emit(EVENTS_DICT.EVENTS.CONNECTION_ADDED,sourceElement, sourcePort, targetElement, targetPort);    
        })

        this.paper.on('link:disconnect', function (link, evt, elementViewDisconnected, magnet, arrowhead) {
            // console.log(magnet.getAttribute('port'), magnet);
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
                //targetElement._handleDisconnect(sourceElement, targetPort, link.model.id);
                targetElement._handleDisconnect(sourceElement, magnet.getAttribute('port'), link.model.id);
                self.emitter.emit(EVENTS_DICT.EVENTS.CONNECTION_REMOVED,sourceElement, sourcePort, targetElement, magnet.getAttribute('port'));    
            }
        })
        this.graph.on('remove', function (cell) {
            // ghost cells (diff overlay) are not part of the flow
            if (cell.get('ghost')) return;

            if (cell.isLink()) {
                var participants = helper.linkGetParticipants(cell, self);

                var sourceElement = participants.sourceElement;
                var targetElement = participants.targetElement;

                var sourcePort = participants.sourcePort;
                var targetPort = participants.targetPort;
                if (targetElement != undefined && sourceElement != undefined) {
                    sourceElement._handleDisconnect(targetElement, sourcePort, cell.id);
                    targetElement._handleDisconnect(sourceElement, targetPort, cell.id);
                    self.emitter.emit(EVENTS_DICT.EVENTS.CONNECTION_REMOVED,sourceElement, sourcePort, targetElement, targetPort);    
                }
            } else {
                var blockToDelete = cell;
                // remove the block 
                self._blocks = self._blocks.filter(block => {
                    return block.id != blockToDelete.id
                })
                self._blocks.forEach(block => {
                    block._handleDelete(blockToDelete);
                })
                self.emitter.emit(EVENTS_DICT.EVENTS.BLOCK_REMOVED,blockToDelete);
            }

        })
    }

    addBlock(block, omitGraph) {
        this._blocks.push(block);
        if(!omitGraph)
            this.graph.addCell(block);
        block._enableRemoval(this.paper);
        this.emitter.emit(EVENTS_DICT.EVENTS.BLOCK_ADDED,block);
    }



    /**
     * Binds graph events used to track diagram modifications (FB-01).
     * Changes are reported with debounced flowblocks:diagram-changed event and mark the diagram as dirty.
     * Changes are ignored when: import is in progress, operation was flagged with {silent: true} or {fbSilent: true}
     * or the changed cell is a ghost (diff overlay).
     */
    _bindChangeEvents(){
        var self = this;
        this.graph.on('add remove change:position change:size change:vertices change:source change:target change:configurables', function(cell){
            var opt = arguments.length > 0 ? arguments[arguments.length-1] : undefined;
            self._handleDiagramChange(cell, opt);
        });
    }

    _handleDiagramChange(cell, opt){
        var self = this;
        if (this._muted > 0) return;
        if (opt && (opt.silent || opt.fbSilent)) return;
        if (cell && cell.get && cell.get('ghost')) return;
        this._dirty = true;
        this._changesPending++;
        if (this._changeTimer) clearTimeout(this._changeTimer);
        this._changeTimer = setTimeout(function(){
            var changes = self._changesPending;
            self._changesPending = 0;
            self._changeTimer = undefined;
            if (self.emitter) self.emitter.emit(EVENTS_DICT.EVENTS.DIAGRAM_CHANGED, { changes: changes, dirty: self._dirty });
        }, DIAGRAM_CHANGED_DEBOUNCE_MS);
    }

    /**
     * @returns true when diagram was modified since creation, import or last markClean()
     */
    isDirty(){
        return this._dirty;
    }

    /**
     * Marks diagram as clean (i.e. after successful save). Pending (not yet emited) change notification is cancelled.
     */
    markClean(){
        this._dirty = false;
        this._changesPending = 0;
        if (this._changeTimer) clearTimeout(this._changeTimer);
        this._changeTimer = undefined;
    }

    _isInteractive(cellView){
        if (this._readOnly) return false;
        if (cellView && cellView.model && cellView.model.get('ghost')) return false;
        // JointJS default
        return { labelMove: false };
    }

    /**
     * Turns read only mode on/off (FB-04). In read only mode paper is not interactive (no moving, no linking,
     * no link tools) and blocks do not present Remove tool.
     * @param {*} readOnly true to turn on read only mode
     */
    setReadOnly(readOnly){
        var self = this;
        this._readOnly = readOnly ? true : false;
        if (this.paper && this.paper.setInteractivity) {
            this.paper.setInteractivity(function(cellView){
                return self._isInteractive(cellView);
            });
            if (this.paper.el && this.paper.el.classList) {
                if (this._readOnly) this.paper.el.classList.add('fb-readonly');
                else this.paper.el.classList.remove('fb-readonly');
            }
            if (this._readOnly) {
                this._blocks.forEach(block=>{
                    var view = block.findView(self.paper);
                    if (view && view.hideTools) view.hideTools();
                });
            }
        }
        return this._readOnly;
    }

    isReadOnly(){
        return this._readOnly;
    }

    setTestIdPrefix(prefix){
        this._testIdPrefix = prefix || 'flowblocks';
    }

    getTestIdPrefix(){
        return this._testIdPrefix;
    }

    /**
     * Finds diagram cell for given id. Id may be either a business block id (blockId) or a JointJS cell id.
     * @param {*} id blockId or cell id
     */
    _findCell(id){
        if (id === undefined || id === null || !this.graph || !this.graph.getCell) return undefined;
        var block = this._blocks.find(element=>{
            return element.get('blockId') == id;
        });
        if (block) return block;
        return this.graph.getCell(id);
    }

    _highlighterOptions(state){
        return { highlighter: { name: 'addClass', options: { className: 'fb-hl-' + state } } };
    }

    _applyHighlight(cell, state, previousState){
        if (!cell || !this.paper || !this.paper.findViewByModel) return;
        var view = this.paper.findViewByModel(cell);
        if (!view) return;
        if (previousState && previousState != state) {
            view.unhighlight(null, this._highlighterOptions(previousState));
        }
        if (state) {
            view.highlight(null, this._highlighterOptions(state));
        }
    }

    /**
     * Highlights blocks and links (FB-07). Highlights are presentation only - they are applied with
     * joint.highlighters (CSS class fb-hl-<state>) so they are neither serialized nor mark diagram as dirty.
     * Highlights survive import (they are re-applied to cells with the same ids).
     * @param {*} spec.blocks Array of {id: blockId or cell id, state: 'ok'|'error'|'timeout'|'current'|'visited'|'added'|'removed'|'changed'}
     * @param {*} spec.links Array of {id: link cell id, state}
     * @param {*} options.replace when true previous highlights are cleared first
     */
    highlight(spec, options){
        var self = this;
        spec = spec || {};
        if (options && options.replace) this.clearHighlights();
        var apply = function(items, isLink){
            (items || []).forEach(item=>{
                if (!item || item.id === undefined) return;
                if (HIGHLIGHT_STATES.indexOf(item.state) == -1) {
                    console.warn('Unsupported highlight state: ' + item.state);
                    return;
                }
                var previous = self._highlights[item.id];
                self._highlights[item.id] = { state: item.state, link: isLink };
                self._applyHighlight(self._findCell(item.id), item.state, previous ? previous.state : undefined);
            });
        };
        apply(spec.blocks, false);
        apply(spec.links, true);
    }

    /**
     * Removes highlights. When ids are provided only highlights of given ids are removed.
     * @param {*} ids (optional) array of block ids / cell ids
     */
    clearHighlights(ids){
        var self = this;
        var toClear = ids ? ids : Object.keys(this._highlights);
        toClear.forEach(id=>{
            var highlight = self._highlights[id];
            if (!highlight) return;
            delete self._highlights[id];
            var cell = self._findCell(id);
            if (cell && self.paper && self.paper.findViewByModel) {
                var view = self.paper.findViewByModel(cell);
                if (view) view.unhighlight(null, self._highlighterOptions(highlight.state));
            }
        });
    }

    getHighlights(){
        return JSON.parse(JSON.stringify(this._highlights));
    }

    _reapplyHighlights(){
        var self = this;
        Object.keys(this._highlights).forEach(id=>{
            self._applyHighlight(self._findCell(id), self._highlights[id].state);
        });
    }

    /**
     * Sets (or removes) block marker presented in the left gutter of the block (FB-08).
     * Markers are presentation only - they are not serialized and do not mark diagram as dirty.
     * @param {*} blockId business id of the block
     * @param {*} kind 'breakpoint'|'breakpoint-cond'|'breakpoint-disabled'| null (removes marker)
     * @param {*} tooltip (optional) marker tooltip
     */
    setMarker(blockId, kind, tooltip){
        if (kind && MARKER_KINDS.indexOf(kind) == -1) {
            throw new Error('Unsupported marker kind: ' + kind);
        }
        if (kind) {
            this._markers[blockId] = { kind: kind, tooltip: tooltip };
        } else {
            delete this._markers[blockId];
        }
        var block = this._blocks.find(element=>{
            return element.get('blockId') == blockId;
        });
        if (block && this.paper && this.paper.findViewByModel) {
            var view = this.paper.findViewByModel(block);
            if (view) this._applyMarker(view);
        }
    }

    getMarkers(){
        return JSON.parse(JSON.stringify(this._markers));
    }

    clearMarkers(){
        var self = this;
        Object.keys(this._markers).forEach(blockId=>{
            self.setMarker(blockId, null);
        });
    }

    _applyMarker(view){
        var markerEl = view.el && view.el.querySelector ? view.el.querySelector('.fb-marker') : undefined;
        if (!markerEl) return;
        var marker = view.model.get('ghost') ? undefined : this._markers[view.model.get('blockId')];
        MARKER_KINDS.forEach(kind=>{
            markerEl.classList.remove('fb-marker-' + kind);
        });
        var titleEl = markerEl.querySelector('title');
        if (marker) {
            markerEl.classList.add('fb-marker-' + marker.kind);
            markerEl.setAttribute('data-marker', marker.kind);
            if (!titleEl) {
                titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
                markerEl.appendChild(titleEl);
            }
            titleEl.textContent = marker.tooltip ? marker.tooltip : marker.kind;
        } else {
            markerEl.removeAttribute('data-marker');
            if (titleEl) titleEl.parentNode.removeChild(titleEl);
        }
        markerEl.setAttribute('data-testid', this._testIdPrefix + '.block.marker');
    }

    /**
     * Applies presentation only decorations to the rendered block view: test ids, data attributes,
     * marker state, highlight and ghost look (FB-05, FB-07, FB-08, FB-10)
     * @param {*} view 
     */
    _decorateView(view){
        var model = view.model;
        var el = view.el;
        if (!el || !el.setAttribute) return;
        var ghost = model.get('ghost') ? true : false;
        el.setAttribute('data-testid', this._testIdPrefix + (ghost ? '.block-ghost' : '.block'));
        el.setAttribute('data-block-id', model.get('blockId') !== undefined ? model.get('blockId') : '');
        el.setAttribute('data-block-type', model.get('_type') !== undefined ? model.get('_type') : '');
        el.setAttribute('data-name', model.get('name') !== undefined ? model.get('name') : '');
        if (ghost) {
            el.classList.add('fb-ghost');
            el.setAttribute('data-ghost', 'true');
        }
        this._applyMarker(view);
        var highlight = this._highlights[model.get('blockId')] || this._highlights[model.id];
        if (highlight) this._applyHighlight(model, highlight.state);
        else if (ghost) this._applyHighlight(model, 'removed');
    }

    /**
     * Presents differences between diagram versions on the current diagram (FB-10). Current diagram should be the
     * candidate (newer) version. Added and changed blocks are highlighted, removed blocks are rendered
     * as translucent, non interactive "ghost" cells (flag ghost: true) which are excluded from export, getDiagram,
     * validation and dirty tracking.
     * @param {*} diff.added Array of block ids
     * @param {*} diff.changed Array of block ids
     * @param {*} diff.removed Array of serialized cells (graph.toJSON().cells items) from the previous version
     */
    showDiff(diff){
        var self = this;
        diff = diff || {};
        this.clearDiff();
        var highlightSpec = { blocks: [] };
        (diff.added || []).forEach(id=>{ highlightSpec.blocks.push({ id: id, state: 'added' }); });
        (diff.changed || []).forEach(id=>{ highlightSpec.blocks.push({ id: id, state: 'changed' }); });
        this.highlight(highlightSpec);
        this._diff.highlighted = highlightSpec.blocks.map(item=>item.id);

        var ghosts = [];
        (diff.removed || []).forEach(serializedCell=>{
            if (!serializedCell || !serializedCell.type) return;
            var ghostJson = JSON.parse(JSON.stringify(serializedCell));
            // links of removed blocks are not presented (their ends may not exist)
            if (ghostJson.source || ghostJson.target) return;
            if (ghostJson.id && self.graph.getCell(ghostJson.id)) ghostJson.id = 'ghost-' + ghostJson.id;
            if (!ghostJson.id) ghostJson.id = 'ghost-' + shortid.generate();
            ghostJson.ghost = true;
            ghostJson.z = ghostJson.z !== undefined ? ghostJson.z : -1;
            ghosts.push(ghostJson);
        });
        if (ghosts.length > 0) {
            this._muted++;
            try {
                ghosts.forEach(ghostJson=>{
                    self.graph.addCell(ghostJson, { fbSilent: true });
                    var ghostCell = self.graph.getCell(ghostJson.id);
                    self._diff.ghosts.push(ghostJson.id);
                    self._applyHighlight(ghostCell, 'removed');
                });
            } finally {
                this._muted--;
            }
        }
    }

    /**
     * Removes diff overlay (highlights of added/changed blocks and ghost cells)
     */
    clearDiff(){
        var self = this;
        if (!this._diff) this._diff = { highlighted: [], ghosts: [] };
        var toUnhighlight = this._diff.highlighted.filter(id=>{
            return self._highlights[id] && (self._highlights[id].state == 'added' || self._highlights[id].state == 'changed');
        });
        this.clearHighlights(toUnhighlight);
        if (this._diff.ghosts.length > 0 && this.graph && this.graph.getCell) {
            this._muted++;
            try {
                this._diff.ghosts.forEach(id=>{
                    var cell = self.graph.getCell(id);
                    if (cell) cell.remove({ fbSilent: true });
                });
            } finally {
                this._muted--;
            }
        }
        this._diff = { highlighted: [], ghosts: [] };
    }

    /**
     * @returns ghost cells currently presented (diff overlay)
     */
    getGhosts(){
        var self = this;
        return this._diff.ghosts.map(id=>self.graph.getCell(id)).filter(cell=>cell);
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
