class Flowblocks {
    constructor(options) {
        this.options = {}
        Object.assign(this.options, options);
    }

    tryMe(){
        console.log('TryMe!');
    }
}
module.exports = new Flowblocks({});