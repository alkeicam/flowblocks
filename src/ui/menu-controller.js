const helper = require('../helper')
const EVENTS_DICT = require('../events-dict')
const shortid = require('shortid');
const DEFAULTS = require('../defaults')

class MenuController {
    constructor(){
        this.emmiter = undefined;
    }
    create(emmiter){
        this.emmiter = emmiter;
    }
    modelSpecificationSave(e, that){
        that.emmiter.emit(EVENTS_DICT.EVENTS.FLOWBLOCKS_SAVE);
    }
    modelSpecificationDownload(e, that){
        that.emmiter.emit(EVENTS_DICT.EVENTS.FLOWBLOCKS_DOWNLOAD);
    }
}
module.exports = new MenuController({});