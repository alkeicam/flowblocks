/**
 * BLOCK_CREATE -> BLOCK_ADDED 
 *      BLOCK_DETAILS_SAVE -> 
 */
class EventsDict {
    constructor(options) {
        this.EVENTS = {
            TOOLBAR_RESET: "toolbar:reset", // typeDefinitions array
            TOOLBAR_ITEM_CREATE: "toolbar-item:create", // typeDefinition, label, size
            TOOLBAR_ITEM_DBLCLICK: "toolbar-item:dblclick",
            TOOLBAR_ITEM_DRAG: "toolbar-item:drag", // typeClicked, block, x, y, event
            TOOLBAR_DRAWER_REQUEST: "toolbar-drawer:requested", // category            
            TOOLBAR_DRAWER_READY: "toolbar-drawer:view-ready", // category, elementid
            TOOLBAR_DRAWER_ATTACHED: "toolbar-drawer:attached", // category, elementid
            TOOLBAR_DRAWER_REMOVED_ALL: "toolbar-drawer:removedall", // empty, deprecated
            TOOLBAR_REMOVED_ALL: "toolbar:removedall", // empty, deprecated
            MENU_IMPORTJSON_REQUESTED: "menu:import-json", // empty   
            
            BLOCK_ADDED: "flowblocks:block-added",
            BLOCK_CREATE: "flowblocks:block-create",   // blockId, type, label, position (x, y), evt
            BLOCK_DETAILS_SAVE: "flowblocks:block-save", // blockId, [i: configurable id, v: configurable value], evt         
            BLOCK_REMOVED: "flowblocks:block-removed",
            BLOCK_DBLCLICK: "flowblocks:block-dblclick",   // block, evt            
            CONNECTION_REMOVED: "flowblocks:connection-removed",
            CONNECTION_ADDED: "flowblocks:connection-added",
            // emited when user wants to save flowblocks specification
            FLOWBLOCKS_SAVE: "flowblocks:save", // save datatype
            // emited when user wants to download flowblocks specification
            FLOWBLOCKS_DOWNLOAD: "flowblocks:download", // empty
            // indicates that user wants to create new type so appropriate form shall be presented
            FLOWBLOCKS_TYPE_CREATE: "flowblocks:type-create", // empty
            // general event, sent as a feedback from any operation
            FLOWBLOCKS_BUSY: "flowblocks:busy", // operation name, extra data
            FLOWBLOCKS_DONE_SUCCESS: "flowblocks:result-ok", // operation name, extra data
            FLOWBLOCKS_DONE_ERROR: "flowblocks:result-error", // operation name, extra data
            FLOWBLOCKS_IMPORT_JSON: "flowblocks:import-json", // json model specification data            
            FLOWBLOCKS_IMPORT_SUCCES: "flowblocks:import-ok", // model name, model id, version
        }
    }

    allEvents() {
        var events = [];        
        Object.keys(this.EVENTS).forEach(eventKey => {
            events.push(this.EVENTS[eventKey]);
        })        
        return events;
    }
}
module.exports = new EventsDict({});