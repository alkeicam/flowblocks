const helper = require('../helper')
const EVENTS_DICT = require('../events-dict')
const shortid = require('shortid');
const DEFAULTS = require('../defaults')

class MenuController {
    constructor(){
        this.emmiter = undefined;
        this.model = {}
    }
    /**
     * 
     * @param {*} emmiter 
     * @param {*} menuContents.b - link to brand image
     * @param {*} menuContents.u - target url when clicked on brand image
     * @param {*} menuContents.c - menu context
     * @param {*} menuContents.s - menu context supplementary
     * @param {*} menuContents.m[i] - first level
     * @param {*} menuContents.m[i].s - true for separator position
     * @param {*} menuContents.m[i].e - event generated when menu option selected
     * @param {*} menuContents.m[i].l - menu position label
     * @param {*} menuContents.m[i].m[j] - second level 
     * @param {*} menuContents.m[i].m[j].s - true for separator position 
     * @param {*} menuContents.m[i].m[j].e - event generated when menu option selected
     * @param {*} menuContents.m[i].m[j].l - menu position label 
     */
    create(emmiter, menuContents){
        var self = this;
        this.emmiter = emmiter;
        if(menuContents){
            this.model = menuContents;
            if(this.model.m){
                this.model.m.forEach(m1=>{
                    m1.menuClick = self.menuClick
                    if(m1.m){
                        m1.m.forEach(m2=>{
                            m2.menuClick = self.menuClick
                        })
                    }
                    
                })
            }
            
        }

    }

    menuClick(e, that){
        var eventName = undefined;

        if(e.srcElement && e.srcElement.dataset){
            eventName = e.srcElement.dataset.event;
        
        }else if(e.target && e.target.dataset){
            eventName = e.target.dataset.event;
        }                      
        if(eventName)
            that.emmiter.emit(eventName);
    }
}
module.exports = new MenuController({});