const jsonSize = require('json-size');

class Api {
    constructor(){
        this.storageContext = '/a/'
    }

    save(datatype, key, dataObject, version){
        if(window && window.localStorage){
            var objCopy = Object.assign({},dataObject);

            var saveable = {
                k: key,
                t: datatype,
                d: objCopy
            }   
            
            var size = jsonSize(objCopy);
            saveable.s = size;
            var path = this.storageContext+datatype+"/"+key+"/"+version;            
            window.localStorage.setItem(path, JSON.stringify(saveable));
            console.log('Saved', path, saveable);
        }else{
            console.warn('Cant save data as local storage is not accessible');
        }
    }

    load(datatype, key, version){
        if(window && window.localStorage){
            var saveable = window.localStorage.getItem(this.storageContext+datatype+"/"+key+"/"+version);
        }else{
            console.warn('Cant load data as local storage is not accessible');
        }
    }

}
module.exports = new Api({});