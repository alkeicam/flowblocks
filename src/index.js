const joint = require("jointjs")
const block = require('./block')

class Flowblocks {
    constructor(options) {
        this.options = {}
        Object.assign(this.options, options);
    }

    tryMe(){
        console.log('TryMe!');        
        this.addElement();
    }

    addElement(label, where, kind){
        var newBlock = block.create();
        //console.log(block.create());
    }


}
module.exports = new Flowblocks({});