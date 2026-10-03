/**
 * Presentation styles of modeler tools (highlights FB-07, markers FB-08, read only FB-04, ghosts FB-10).
 * Styles are injected once into document head so no additional stylesheet is required.
 */
const STYLE_ELEMENT_ID = 'flowblocks-core-styles';

const CSS = [
    /* FB-07 highlights - blocks */
    '.joint-element[class*="fb-hl-"] .fb-icon-rect, .joint-element[class*="fb-hl-"] .fb-label-rect, .joint-element[class*="fb-hl-"] .fb-status-rect { stroke-width: 3px; }',
    '.joint-element.fb-hl-ok .fb-icon-rect, .joint-element.fb-hl-ok .fb-label-rect, .joint-element.fb-hl-ok .fb-status-rect { stroke: #00b894; }',
    '.joint-element.fb-hl-ok > .rotatable { filter: drop-shadow(0 0 4px #00b894); }',
    '.joint-element.fb-hl-error .fb-icon-rect, .joint-element.fb-hl-error .fb-label-rect, .joint-element.fb-hl-error .fb-status-rect { stroke: #d63031; }',
    '.joint-element.fb-hl-error > .rotatable { filter: drop-shadow(0 0 5px #d63031); }',
    '.joint-element.fb-hl-timeout .fb-icon-rect, .joint-element.fb-hl-timeout .fb-label-rect, .joint-element.fb-hl-timeout .fb-status-rect { stroke: #e17055; stroke-dasharray: 6 3; }',
    '.joint-element.fb-hl-timeout > .rotatable { filter: drop-shadow(0 0 5px #e17055); }',
    '.joint-element.fb-hl-current .fb-icon-rect, .joint-element.fb-hl-current .fb-label-rect, .joint-element.fb-hl-current .fb-status-rect { stroke: #0984e3; stroke-width: 4px; }',
    '.joint-element.fb-hl-current > .rotatable { filter: drop-shadow(0 0 8px #0984e3); }',
    '.joint-element.fb-hl-visited .fb-icon-rect, .joint-element.fb-hl-visited .fb-label-rect, .joint-element.fb-hl-visited .fb-status-rect { stroke: #74b9ff; }',
    '.joint-element.fb-hl-added .fb-icon-rect, .joint-element.fb-hl-added .fb-label-rect, .joint-element.fb-hl-added .fb-status-rect { stroke: #00b894; stroke-dasharray: 2 2; }',
    '.joint-element.fb-hl-added > .rotatable { filter: drop-shadow(0 0 6px #55efc4); }',
    '.joint-element.fb-hl-changed .fb-icon-rect, .joint-element.fb-hl-changed .fb-label-rect, .joint-element.fb-hl-changed .fb-status-rect { stroke: #fdcb6e; }',
    '.joint-element.fb-hl-changed > .rotatable { filter: drop-shadow(0 0 6px #fdcb6e); }',
    '.joint-element.fb-hl-removed { opacity: 0.4; }',
    '.joint-element.fb-hl-removed .fb-icon-rect, .joint-element.fb-hl-removed .fb-label-rect, .joint-element.fb-hl-removed .fb-status-rect { stroke: #d63031; stroke-dasharray: 4 4; }',
    /* FB-07 highlights - links */
    '.joint-link[class*="fb-hl-"] .connection { stroke-width: 3px; }',
    '.joint-link.fb-hl-ok .connection { stroke: #00b894; }',
    '.joint-link.fb-hl-error .connection { stroke: #d63031; }',
    '.joint-link.fb-hl-timeout .connection { stroke: #e17055; stroke-dasharray: 6 3; }',
    '.joint-link.fb-hl-current .connection { stroke: #0984e3; stroke-width: 4px; }',
    '.joint-link.fb-hl-visited .connection { stroke: #74b9ff; }',
    '.joint-link.fb-hl-added .connection { stroke: #00b894; stroke-dasharray: 2 2; }',
    '.joint-link.fb-hl-changed .connection { stroke: #fdcb6e; }',
    '.joint-link.fb-hl-removed .connection { stroke: #d63031; opacity: 0.4; stroke-dasharray: 4 4; }',
    /* FB-08 markers (left gutter) */
    '.fb-marker { fill: transparent; stroke: transparent; stroke-width: 1.5px; cursor: pointer; }',
    '.joint-element:hover .fb-marker { stroke: #d63031; stroke-opacity: 0.5; }',
    '.fb-marker.fb-marker-breakpoint { fill: #d63031; stroke: #b71c1c; stroke-opacity: 1; }',
    '.fb-marker.fb-marker-breakpoint-cond { fill: #e17055; stroke: #b71c1c; stroke-opacity: 1; stroke-dasharray: 2 1; }',
    '.fb-marker.fb-marker-breakpoint-disabled { fill: #ffffff; stroke: #d63031; stroke-opacity: 1; }',
    /* FB-04 read only */
    '.fb-readonly .link-tools, .fb-readonly .marker-arrowheads, .fb-readonly .marker-vertices, .fb-readonly .joint-tools { display: none; }',
    '.fb-readonly .joint-element { cursor: default; }',
    /* FB-10 ghosts (removed blocks in diff overlay) */
    '.joint-element.fb-ghost { opacity: 0.35; pointer-events: none; }',
    '.joint-element.fb-ghost .joint-port { display: none; }'
].join('\n');

function inject(){
    if (typeof document === 'undefined' || !document || !document.head) return false;
    if (document.getElementById(STYLE_ELEMENT_ID)) return false;
    var style = document.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.type = 'text/css';
    style.appendChild(document.createTextNode(CSS));
    document.head.appendChild(style);
    return true;
}

module.exports = {
    CSS: CSS,
    inject: inject
};
