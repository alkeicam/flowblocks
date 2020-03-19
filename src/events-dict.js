class EventsDict {
    constructor(options) {
        this.EVENTS = {
            TOOLBAR_ITEM_DBLCLICK: "toolbar-item:dblclick"
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