const jointjs = require("jointjs")

class Flowblocks {
    constructor(options) {
        this.options = {}
        Object.assign(this.options, options);
    }

    tryMe(){
        console.log('TryMe!');
        console.log(new jointjs.dia.Graph);
    }
}
module.exports = new Flowblocks({});