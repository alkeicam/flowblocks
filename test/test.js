// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

const assert = chai.assert;
const expect = chai.expect;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');


const flowblocks = require('../');

describe('Flowblocks', () => {
    describe('registerType', () => {
        let USER_ID = '#userId';
        let TYPE = 'MyType';
        let TYPE2 = 'MyType2';
        let TEMPLATE = 'PassThrough';
        let TEMPLATE2 = 'PassThrough2';
        beforeEach(() => {            
        });
        afterEach(() => {
        });                
        it('register type', () => {
            var type = flowblocks.registerType(TYPE,TEMPLATE);
            return expect(type.name).equals(TYPE);
        })

        it('register multiple types', () => {
            var type1 = flowblocks.registerType(TYPE,TEMPLATE);
            var type2 = flowblocks.registerType(TYPE2,TEMPLATE);

            var typeDef = flowblocks._registeredTypes[TYPE] != undefined ? true: false;
            var typeDef2 = flowblocks._registeredTypes[TYPE2] != undefined ? true: false;            
            return expect(typeDef && typeDef2).is.true;            
        })
        it('overwrite type', () => {
            var type1 = flowblocks.registerType(TYPE,TEMPLATE);
            var type2 = flowblocks.registerType(TYPE,TEMPLATE2);            
            return expect(type2.template).equal(TEMPLATE2);
        })
        
    })        
})
