// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

const assert = chai.assert;
const expect = chai.expect;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');


const theModule = require('../');

describe('Test', () => {
    describe('test', () => {
        let USER_ID = '#userId';
        beforeEach(() => {            
        });
        afterEach(() => {
        });
        it('sample chec', () => {
            return expect('a').equals('a');
        })
        
    })        
})
