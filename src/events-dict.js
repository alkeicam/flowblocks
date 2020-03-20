class EventsDict {
    constructor(options) {
        this.EVENTS = {
            TOOLBAR_ITEM_DBLCLICK: "toolbar-item:dblclick",
            BLOCK_ADDED: "block:added",
            BLOCK_REMOVED: "block:removed",
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