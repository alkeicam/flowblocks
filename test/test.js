// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

const assert = chai.assert;
const expect = chai.expect;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');

const block = require('../src/block')


const flowblocks = require('../');

describe('Flowblocks', () => {
    describe('Block', () => {
        let DEFINITION = {
            name: 'Dense',
            category: 'Basic',
            template: 'PassThrough',
            icon: 'burrito',
            style: 'cream',
            configurables: [
                { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
                { id: 'units', label: 'Units', placeholder: 'i.e. 4', type: 'NUMBER', required: true },
                { id: 'activation', label: 'Activation function', placeholder: '', type: 'LIST', required: false, options: [{ v: 'elu', l: 'elu' }, { v: 'hardSigmoid', l: 'hardSigmoid' }, { v: 'linear', l: 'linear' }, { v: 'relu', l: 'relu' }, { v: 'relu6', l: 'relu6' }, { v: 'selu', l: 'selu' }, { v: 'sigmoid', l: 'sigmoid' }, { v: 'softmax', l: 'softmax' }, { v: 'softplus', l: 'softplus' }, { v: 'softsign', l: 'softsign' }, { v: 'tanh', l: 'tanh' }], default: 'undefined' },
                { id: 'useBias', label: 'Apply bias', placeholder: 'true, false', type: 'BOOLEAN', required: false },
                { id: 'kernelInitializer', label: 'Kernal initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: 'undefined' },
                { id: 'biasInitializer', label: 'Bias initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: 'undefined' },
                { id: 'inputDim', label: 'Input shape', placeholder: 'i.e. 3', type: 'NUMBER', required: false },
                { id: 'kernelConstraint', label: 'Kernel constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: 'undefined' },
                { id: 'biasConstraint', label: 'Bias constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: 'undefined' },
                { id: 'kernelRegularizer', label: 'Kernel regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
                { id: 'biasRegularizer', label: 'Bias regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
                { id: 'activityRegularizer', label: 'Activity regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
                { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
                { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
                { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
                { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: 'undefined' },
                { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
            ],
            validationFunction: function (blockData) {
                var errors = [];   
                
                var item = blockData.configurable('units');
                
                if(item && (isNaN(Number(item))||Number(item)<0 ||!Number.isInteger(Number(item)))){
                    errors.push({ code: 'P_UNITS', cId: 'Units', msg: 'Units must be a positive integer' })
                }                     
                
                return errors;
            }
        }
        describe('Validations',()=>{
            let B1 = block.createBlank('B1', DEFINITION.name, DEFINITION.template, undefined, DEFINITION.style, DEFINITION.validationFunction, DEFINITION.configurables);
            it('mandatory fields validation 1', () => {
                B1.setConfigurables([
                    {i: 'name', v: 'some name'},
                ])
                var status = B1.getStatus();
                return expect(status.valid).false;
            })
            it('mandatory fields validation 2', () => {
                B1.setConfigurables([
                    {i: 'name', v: 'some name'},
                ])
                var errors = B1.getStatus().errors;
                var fieldId = errors.filter(item=>{
                    return item.code == 'FIELD_REQUIRED'
                })[0].cId;
                return expect(fieldId).eq('units');
            })
            it('mandatory fields validation 3', () => {
                B1.setConfigurables([
                    {i: 'name', v: 'some name'},{i: 'units', v: 'some name'}
                ])
                var errors = B1.getStatus().errors;
                var requiredFieldsArray = errors.filter(item=>{
                    return item.code == 'FIELD_REQUIRED'
                });
                return expect(requiredFieldsArray.length).eq(0)
            })
            it('ports validation 1', () => {
                B1.setConfigurables([
                    {i: 'name', v: 'some name'},{i: 'units', v: 'some name'}
                ])
                var status = B1.getStatus();
                return expect(status.valid).false;
            })
            it('ports validation 2', () => {
                B1.setConfigurables([
                    {i: 'name', v: 'some name'},{i: 'units', v: 'some name'}
                ])
                var errors = B1.getStatus().errors;
                var invalidFields = errors.filter(item=>{
                    return item.code == 'PORT_NOT_CONNECTED'
                });
                return expect(invalidFields.length).eq(2);
            })
            

            it('ports validation 3', () => {
                B1.setConfigurables([
                    {i: 'name', v: 'some name'},{i: 'units', v: 'some name'}
                ])
                var errors = B1.getStatus().errors;
                var invalidFields = errors.filter(item=>{
                    return item.code == 'PORT_NOT_CONNECTED'
                });
                return expect(invalidFields[0].cId).eq('in1');
            })
            
        })
        describe('Configurables',()=>{            
            let B1 = block.createBlank('B1', DEFINITION.name, DEFINITION.template, undefined, DEFINITION.style, DEFINITION.validationFunction, DEFINITION.configurables);
            it('setConfigurables', () => {
                B1.setConfigurables([
                    {i: 'units', v: 4},{i: 'name', v: 'some name'},
                ])
                var v = B1.getConfigurable('units')
                return expect(v).eq(4)
            })
            it('setConfigurable - adding', () => {
                B1.setConfigurables([
                    {i: 'units', v: 4},{i: 'name', v: 'some name'},
                ])
                B1.setConfigurable('activation','elu');
                
                var v = B1.getConfigurable('activation')
                return expect(v).eq('elu')
            })
            it('setConfigurable - updating', () => {
                B1.setConfigurables([
                    {i: 'units', v: 4},{i: 'name', v: 'some name'},
                ])
                B1.setConfigurable('units',256);
                
                var v = B1.getConfigurable('units')
                return expect(v).eq(256)
            })
            it('getConfigurable - number', () => {
                B1.setConfigurables([
                    {i: 'units', v: 4},{i: 'name', v: 'some name'},
                ])
                var v = B1.getConfigurable('units')
                return expect(v).eq(4)
            })
            it('getConfigurable - text', () => {
                B1.setConfigurables([
                    {i: 'units', v: '4'},{i: 'name', v: 'some name'},
                ])
                var v = B1.getConfigurable('name')
                return expect(v).eq('some name')
            })
            it('getConfigurable - boolean', () => {
                B1.setConfigurables([
                    {i: 'units', v: '4'},{i: 'name', v: 'some name'},{i: 'trainable', v: 'false'}
                ])
                var v = B1.getConfigurable('trainable')
                return expect(v).false;
            })
        })
    })
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
