/**
 * BLOCK_CREATE -> BLOCK_ADDED 
 *      BLOCK_DETAILS_SAVE -> 
 */
class EventsDict {
    constructor(options) {
        this.EVENTS = {
            TOOLBAR_ITEM_DBLCLICK: "toolbar-item:dblclick",
            BLOCK_ADDED: "block:added",
            BLOCK_CREATE: "block:create",   // blockId, type, label, evt
            BLOCK_DETAILS_SAVE: "block:save", // blockId, [i: configurable id, v: configurable value], evt         
            BLOCK_REMOVED: "block:removed",
            BLOCK_DBLCLICK: "block:dblclick",   // block, evt
            CONNECTION_REMOVED: "connection:removed",
            CONNECTION_ADDED: "connection:added",
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