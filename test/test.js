// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

const assert = chai.assert;
const expect = chai.expect;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');

const block = require('../src/block');
const Flow = require('../src/flow');

const flowblocks = require('../');

describe('Flowblocks', () => {
    describe('Module',()=>{
        let SPEC_ID = 'PZa1PYfus';
        let VER_ID = 1;
        let SPEC_OVERWRITE_ID = 'someother';
        let VER_OVERWRITE_ID = 7;
        let NAME = 'Flowblocks #PZa1PYfus';
        let NAME_OVERWRITE = 'New Name';
        describe('Import/Export',()=>{
            beforeEach(()=>{
                s1 = sinon.stub(Flow,'import').returns();
                s2 = sinon.stub(flowblocks, 'registerTypes').returns();
                s3 = sinon.stub(flowblocks, 'rebuildToolbar').returns();
                s4 = sinon.stub(Flow,'create').returns({import: function(){}});
                s5 = sinon.stub(flowblocks,'raise').returns();
                fflow = flowblocks.createFlow('someId','someName','businessId');
                s6 = sinon.stub(fflow, 'import').returns();
            })
            afterEach(()=>{
                s1.restore();
                s2.restore();
                s3.restore();
                s4.restore();
                s5.restore();
                s6.restore();
            })
            it('by default load types (1)',()=>{
                flowblocks.import('{"types":{}}');                
                return expect(s2.callCount).eq(1);
            })
            it('by default load types (2)',()=>{
                flowblocks.import('{"types":{}}');                
                return expect(s3.callCount).eq(1);
            })
            it('skip type loading when requested',()=>{
                flowblocks.import('{"types":{}}', false);                
                return expect(s2.callCount).eq(0);
            })
            it('skip type loading when requested (2)',()=>{
                flowblocks.import('{"types":{}}', false);                
                return expect(s3.callCount).eq(0);
            })
            it('by default do not overwrite specification id and version - specification id',()=>{
                flowblocks.import('{"cells":[],"name":"'+NAME+'","id":"'+SPEC_ID+'","created":1586522483773,"exported":1586522848569,"version":'+VER_ID+',"types":{}}');                                
                call = s6.getCall(0);
                return expect(call.args[0].id).eq(SPEC_ID);
            })
            it('by default do not overwrite specification id and version - specification id',()=>{
                flowblocks.import('{"cells":[],"name":"'+NAME+'","id":"'+SPEC_ID+'","created":1586522483773,"exported":1586522848569,"version":'+VER_ID+',"types":{}}');                
                call = s6.getCall(0);
                return expect(call.args[0].version).eq(VER_ID);
            })
            it('specification id overwrite',()=>{
                flowblocks.import('{"cells":[],"name":"'+NAME+'","id":"'+SPEC_ID+'","created":1586522483773,"exported":1586522848569,"version":'+VER_ID+',"types":{}}', true, {specificationId: SPEC_OVERWRITE_ID});                                
                call = s6.getCall(0);
                return expect(call.args[0].id).eq(SPEC_OVERWRITE_ID);
            })
            it('specification id overwrite = version not changed',()=>{
                flowblocks.import('{"cells":[],"name":"'+NAME+'","id":"'+SPEC_ID+'","created":1586522483773,"exported":1586522848569,"version":'+VER_ID+',"types":{}}', true, {specificationId: SPEC_OVERWRITE_ID});                                
                call = s6.getCall(0);
                return expect(call.args[0].version).eq(VER_ID);
            })
            it('version id overwrite',()=>{
                flowblocks.import('{"cells":[],"name":"'+NAME+'","id":"'+SPEC_ID+'","created":1586522483773,"exported":1586522848569,"version":'+VER_ID+',"types":{}}', true, {versionId: VER_OVERWRITE_ID});                                
                call = s6.getCall(0);
                return expect(call.args[0].version).eq(VER_OVERWRITE_ID);
            })
            it('version id overwrite = specification not changed',()=>{
                flowblocks.import('{"cells":[],"name":"'+NAME+'","id":"'+SPEC_ID+'","created":1586522483773,"exported":1586522848569,"version":'+VER_ID+',"types":{}}', true, {versionId: VER_OVERWRITE_ID});                                
                call = s6.getCall(0);
                return expect(call.args[0].id).eq(SPEC_ID);
            })
            it('specification id and version id overwrite (1)',()=>{
                flowblocks.import('{"cells":[],"name":"'+NAME+'","id":"'+SPEC_ID+'","created":1586522483773,"exported":1586522848569,"version":'+VER_ID+',"types":{}}', true, {specificationId: SPEC_OVERWRITE_ID, versionId: VER_OVERWRITE_ID});                                
                call = s6.getCall(0);
                return expect(call.args[0].id).eq(SPEC_OVERWRITE_ID);
            })
            it('specification id and version id overwrite (1)',()=>{
                flowblocks.import('{"cells":[],"name":"'+NAME+'","id":"'+SPEC_ID+'","created":1586522483773,"exported":1586522848569,"version":'+VER_ID+',"types":{}}', true, {specificationId: SPEC_OVERWRITE_ID, versionId: VER_OVERWRITE_ID});                                
                call = s6.getCall(0);
                return expect(call.args[0].version).eq(VER_OVERWRITE_ID);
            })
            it('name overwrite ',()=>{
                flowblocks.import('{"cells":[],"name":"'+NAME+'","id":"'+SPEC_ID+'","created":1586522483773,"exported":1586522848569,"version":'+VER_ID+',"types":{}}', true, {specificationId: SPEC_OVERWRITE_ID, versionId: VER_OVERWRITE_ID, name: NAME_OVERWRITE});                                
                call = s6.getCall(0);
                return expect(call.args[0].name).eq(NAME_OVERWRITE);
            })
            it('name no overwrite ',()=>{
                flowblocks.import('{"cells":[],"name":"'+NAME+'","id":"'+SPEC_ID+'","created":1586522483773,"exported":1586522848569,"version":'+VER_ID+',"types":{}}', true, {specificationId: SPEC_OVERWRITE_ID, versionId: VER_OVERWRITE_ID});                                
                call = s6.getCall(0);
                return expect(call.args[0].name).eq(NAME);
            })
            it('flowblocks version is aligned after import',()=>{
                flowblocks.import('{"cells":[],"name":"'+NAME+'","id":"'+SPEC_ID+'","created":1586522483773,"exported":1586522848569,"version":'+VER_ID+',"types":{}}', true, {specificationId: SPEC_OVERWRITE_ID, versionId: VER_OVERWRITE_ID});                                
                
                return expect(flowblocks.version).eq(VER_OVERWRITE_ID);
            })

        })
    })
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
        let DEFINITION_NO_NAME = {
            name: 'Dense',
            category: 'Basic',
            template: 'PassThrough',
            icon: 'burrito',
            style: 'cream',
            configurables: [                
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
            let B2 = block.createBlank('B2', DEFINITION_NO_NAME.name, DEFINITION_NO_NAME.template, undefined, DEFINITION_NO_NAME.style, DEFINITION_NO_NAME.validationFunction, DEFINITION_NO_NAME.configurables);
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

            it("add configurable definition - special case for name - no name existing",()=>{
                const NAME_VAL = "malina";
                const NAME = "name";
                B2.setConfigurable(NAME,NAME_VAL);
                const v = B2.getConfigurable(NAME);
                return expect(v).eq(NAME_VAL);
            })
            it("add configurable definition - special case for name - no name existing - check for definition - label",()=>{
                const NAME_VAL = "malina";
                const NAME = "name";
                B2.setConfigurable(NAME,NAME_VAL);
                const definitions = B2.get("_configurablesDefinitions");
                const definition = definitions.find((item)=>{return item.id == NAME});

                return expect(definition.label).eq(NAME);
            })
            it("add configurable definition - special case for name - no name existing - check for definition - id",()=>{
                const NAME_VAL = "malina";
                const NAME = "name";
                B2.setConfigurable(NAME,NAME_VAL);
                const definitions = B2.get("_configurablesDefinitions");
                const definition = definitions.find((item)=>{return item.id == NAME});

                return expect(definition.id).eq(NAME);
            })
            it("add configurable definition - special case for name - no name existing - check for definition - type",()=>{
                const NAME_VAL = "malina";
                const NAME = "name";
                B2.setConfigurable(NAME,NAME_VAL);
                const definitions = B2.get("_configurablesDefinitions");
                const definition = definitions.find((item)=>{return item.id == NAME});

                return expect(definition.type).eq("TEXT");
            })
            it("add configurable definition - special case for name - no name existing - check for definition - required",()=>{
                const NAME_VAL = "malina";
                const NAME = "name";
                B2.setConfigurable(NAME,NAME_VAL);
                const definitions = B2.get("_configurablesDefinitions");
                const definition = definitions.find((item)=>{return item.id == NAME});

                return expect(definition.required).is.true;
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

    describe('Modeler tools (LLD-012 §12)', () => {
        const EVENTS = require('../src/events-dict').EVENTS;
        let fb;
        let paperDiv;
        const TYPES = [
            { name: 'Start', template: 'Start', icon: 'agave', style: 'cream', category: 'core', configurables: [] },
            { name: 'Step', template: 'PassThrough', icon: 'agave', style: 'cream', category: 'core', configurables: [{ id: 'code', label: 'Code', type: 'TEXT', required: false }] },
            { name: 'End', template: 'End', icon: 'agave', style: 'cream', category: 'core', configurables: [] }
        ];
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const connect = (source, target) => {
            const link = new joint.dia.Link({ source: { id: source.id, port: 'out1' }, target: { id: target.id, port: 'in1' } });
            fb.flow.graph.addCell(link);
            const linkView = link.findView(fb.flow.paper);
            const targetView = target.findView(fb.flow.paper);
            const magnet = targetView.el.querySelector('[port="in1"]');
            fb.flow.paper.trigger('link:connect', linkView, {}, targetView, magnet, 'target');
            return link;
        };
        const buildDiagram = () => {
            const s = fb.createBlock('Start', 'start', 'S1', { x: 10, y: 10 });
            const a = fb.createBlock('Step', 'step a', 'A1', { x: 200, y: 10 });
            const e = fb.createBlock('End', 'end', 'E1', { x: 400, y: 10 });
            const l1 = connect(s, a);
            const l2 = connect(a, e);
            return { s, a, e, l1, l2 };
        };

        beforeEach(() => {
            paperDiv = document.createElement('div');
            paperDiv.id = 'fb-test-paper';
            document.body.appendChild(paperDiv);
            fb = flowblocks.create();
            fb.createFlow('fb-test-paper', 'Test', 'T1');
            fb.registerTypes(TYPES);
        });
        afterEach(() => {
            fb.markClean();
            paperDiv.remove();
        });

        describe('FB-T13 diagramy bez _style (generowane poza edytorem, np. szablony ADI)', () => {
            const spec = () => ({
                name: 'tpl', id: 'tpl', version: 1, created: 1, cells: [
                    { type: 'flowblocks.Block', id: 'c1', blockId: 'b-1', name: 'start', _type: 'Start', _template: 'Start', position: { x: 0, y: 0 }, size: { width: 90, height: 90 }, inPorts: [], outPorts: ['out1'], configurables: [{ i: 'name', v: 'start' }], _portConnections: [{ port: 'out1', id: 'c2', targetPort: 'in1', linkId: 'l1' }] },
                    { type: 'flowblocks.Block', id: 'c2', blockId: 'b-2', name: 'end', _type: 'End', _template: 'End', position: { x: 200, y: 0 }, size: { width: 90, height: 90 }, inPorts: ['in1'], outPorts: [], configurables: [{ i: 'name', v: 'end' }], _portConnections: [] },
                    { type: 'link', id: 'l1', source: { id: 'c1', port: 'out1' }, target: { id: 'c2', port: 'in1' } }
                ]
            });
            it('FB-T13 ponowny import do tej samej instancji (przełączanie modeli w podglądzie) nie kończy się błędem', () => {
                fb.import(JSON.stringify(spec()), false);
                expect(() => fb.import(JSON.stringify(spec()), false)).not.throw();
                return expect(fb.getDiagram().cells.length).eq(3);
            });
            it('FB-T13 kolor stanu walidacji z domyślnego stylu, bez zapisu _style do modelu', () => {
                fb.import(JSON.stringify(spec()), false);
                fb.import(JSON.stringify(spec()), false);
                const cell = fb.getDiagram().cells.find(c => c.blockId === 'b-2');
                return expect(cell._style).undefined;
            });
        });

        describe('FB-T1 FB-00 connection events', () => {
            it('FB-T1 link:connect emits CONNECTION_ADDED (not CONNECTION_REMOVED)', () => {
                const added = sinon.spy();
                const removed = sinon.spy();
                fb.on(EVENTS.CONNECTION_ADDED, added);
                fb.on(EVENTS.CONNECTION_REMOVED, removed);
                const s = fb.createBlock('Start', 'start', 'S1');
                const a = fb.createBlock('Step', 'a', 'A1');
                connect(s, a);
                expect(added.callCount).eq(1);
                expect(added.getCall(0).args[1]).eq('out1');
                expect(added.getCall(0).args[3]).eq('in1');
                return expect(removed.callCount).eq(0);
            })
        })

        describe('FB-T2 FB-01 diagram-changed and dirty flag', () => {
            it('FB-T2 new flow is clean', () => {
                return expect(fb.isDirty()).false;
            })
            it('FB-T2 block add marks dirty and emits single debounced event', async () => {
                const changed = sinon.spy();
                fb.on(EVENTS.DIAGRAM_CHANGED, changed);
                const b = fb.createBlock('Step', 'a', 'A1');
                b.set('position', { x: 50, y: 60 });
                b.set('position', { x: 70, y: 60 });
                expect(fb.isDirty()).true;
                expect(changed.callCount).eq(0);
                await wait(200);
                expect(changed.callCount).eq(1);
                return expect(changed.getCall(0).args[0].changes).gte(3);
            })
            it('FB-T2 configurables change marks dirty', () => {
                const b = fb.createBlock('Step', 'a', 'A1');
                fb.markClean();
                fb.notify(EVENTS.BLOCK_DETAILS_SAVE, 'A1', [{ i: 'name', v: 'a' }, { i: 'code', v: 'X' }]);
                return expect(fb.isDirty()).true;
            })
            it('FB-T2 markClean resets dirty flag and cancels pending event', async () => {
                const changed = sinon.spy();
                fb.on(EVENTS.DIAGRAM_CHANGED, changed);
                fb.createBlock('Step', 'a', 'A1');
                fb.markClean();
                await wait(200);
                expect(changed.callCount).eq(0);
                return expect(fb.isDirty()).false;
            })
            it('FB-T2 import is muted and leaves diagram clean', async () => {
                buildDiagram();
                const json = JSON.stringify(fb.export());
                fb.markClean();
                const changed = sinon.spy();
                fb.on(EVENTS.DIAGRAM_CHANGED, changed);
                fb.import(json, false);
                await wait(200);
                expect(fb.flow._blocks.length).eq(3);
                expect(changed.callCount).eq(0);
                return expect(fb.isDirty()).false;
            })
            it('FB-T2 operations flagged {silent: true} / {fbSilent: true} are muted', () => {
                const b = fb.createBlock('Step', 'a', 'A1');
                fb.markClean();
                b.set('position', { x: 1, y: 1 }, { silent: true });
                b.set('position', { x: 2, y: 2 }, { fbSilent: true });
                return expect(fb.isDirty()).false;
            })
        })

        describe('FB-T3 FB-02 getDiagram', () => {
            it('FB-T3 returns deep copy with cells', () => {
                const d = buildDiagram();
                const diagram = fb.getDiagram();
                diagram.cells[0].position.x = 9999;
                expect(diagram.cells.length).eq(5);
                return expect(d.s.get('position').x).not.eq(9999);
            })
            it('FB-T3 strips requested attributes', () => {
                buildDiagram();
                const diagram = fb.getDiagram({ strip: ['attrs', '_style', '_validationSource'] });
                const withStripped = diagram.cells.filter(c => c.attrs !== undefined || c._style !== undefined || c._validationSource !== undefined);
                expect(withStripped.length).eq(0);
                return expect(diagram.cells.find(c => c.blockId == 'A1').configurables).to.be.an('array');
            })
            it('FB-T3 has no export() side effects (version, exported)', () => {
                buildDiagram();
                const exportedBefore = fb.flow.graph.get('exported');
                const versionBefore = fb.flow.graph.get('version');
                fb.getDiagram();
                expect(fb.flow.graph.get('exported')).eq(exportedBefore);
                expect(fb.flow.graph.get('version')).eq(versionBefore);
                return expect(fb.getDiagram().types).undefined;
            })
            it('FB-T3 types attached on request', () => {
                return expect(Object.keys(fb.getDiagram({ types: true }).types)).to.include('Step');
            })
        })

        describe('FB-T5 FB-04 read only', () => {
            it('FB-T5 paper is not interactive in read only mode', () => {
                const b = fb.createBlock('Step', 'a', 'A1');
                const view = b.findView(fb.flow.paper);
                expect(view.can('elementMove')).true;
                fb.setReadOnly(true);
                expect(view.can('elementMove')).false;
                expect(view.can('addLinkFromMagnet')).false;
                expect(fb.flow.paper.el.classList.contains('fb-readonly')).true;
                fb.setReadOnly(false);
                return expect(view.can('elementMove')).true;
            })
            it('FB-T5 Remove tool is not shown in read only mode', () => {
                const b = fb.createBlock('Step', 'a', 'A1');
                const view = b.findView(fb.flow.paper);
                const showTools = sinon.spy(view, 'showTools');
                fb.setReadOnly(true);
                fb.flow.paper.trigger('element:mouseenter', view, {});
                fb.setReadOnly(false);
                fb.flow.paper.trigger('element:mouseenter', view, {});
                return expect(showTools.callCount).eq(1);
            })
            it('FB-T5 UI create / save / import requests are ignored in read only mode', () => {
                const b = fb.createBlock('Step', 'a', 'A1');
                fb.setReadOnly(true);
                fb.notify(EVENTS.BLOCK_CREATE, 'B2', 'Step', 'b', { x: 1, y: 1 });
                fb.notify(EVENTS.BLOCK_DETAILS_SAVE, 'A1', [{ i: 'name', v: 'changed' }]);
                fb.notify(EVENTS.FLOWBLOCKS_IMPORT_JSON_SKIP_TYPES, JSON.stringify({ cells: [], types: {} }));
                fb.setReadOnly(false);
                expect(fb.flow._blocks.length).eq(1);
                return expect(b.get('name')).eq('a');
            })
            it('FB-T5 readonly-changed event is emited', () => {
                const spy = sinon.spy();
                fb.on(EVENTS.READONLY_CHANGED, spy);
                fb.setReadOnly(true);
                fb.setReadOnly(false);
                return expect(spy.args.map(a => a[0])).deep.eq([true, false]);
            })
        })

        describe('FB-T6 FB-05 block test ids', () => {
            it('FB-T6 block element has data-testid, data-block-id, data-block-type', () => {
                fb.createBlock('Step', 'my step', 'A1');
                const el = paperDiv.querySelector('[data-block-id="A1"]');
                expect(el.getAttribute('data-testid')).eq('flowblocks.block');
                expect(el.getAttribute('data-block-type')).eq('Step');
                return expect(el.getAttribute('data-name')).eq('my step');
            })
            it('FB-T6 test id prefix is configurable', () => {
                fb.setTestIdPrefix('rule-editor');
                fb.createBlock('Step', 'my step', 'A1');
                const el = paperDiv.querySelector('[data-block-id="A1"]');
                fb.setTestIdPrefix(undefined);
                return expect(el.getAttribute('data-testid')).eq('rule-editor.block');
            })
            it('FB-T6 data-name follows block name changes', () => {
                fb.createBlock('Step', 'my step', 'A1');
                fb.notify(EVENTS.BLOCK_DETAILS_SAVE, 'A1', [{ i: 'name', v: 'renamed' }]);
                return expect(paperDiv.querySelector('[data-block-id="A1"]').getAttribute('data-name')).eq('renamed');
            })
        })

        describe('FB-T7 FB-07 highlights', () => {
            it('FB-T7 highlight adds fb-hl-<state> class to block (by blockId) and link (by id)', () => {
                const d = buildDiagram();
                fb.highlight({ blocks: [{ id: 'A1', state: 'current' }, { id: d.s.id, state: 'visited' }], links: [{ id: d.l1.id, state: 'ok' }] });
                expect(d.a.findView(fb.flow.paper).el.classList.contains('fb-hl-current')).true;
                expect(d.s.findView(fb.flow.paper).el.classList.contains('fb-hl-visited')).true;
                return expect(d.l1.findView(fb.flow.paper).el.classList.contains('fb-hl-ok')).true;
            })
            it('FB-T7 highlight is not serialized and does not mark dirty', async () => {
                buildDiagram();
                fb.markClean();
                const changed = sinon.spy();
                fb.on(EVENTS.DIAGRAM_CHANGED, changed);
                const before = JSON.stringify(fb.getDiagram());
                fb.highlight({ blocks: [{ id: 'A1', state: 'error' }, { id: 'E1', state: 'timeout' }] });
                expect(JSON.stringify(fb.getDiagram())).eq(before);
                expect(JSON.stringify(fb.export())).not.contain('fb-hl-');
                await wait(200);
                expect(changed.callCount).eq(0);
                return expect(fb.isDirty()).false;
            })
            it('FB-T7 state change replaces previous class, clearHighlights removes all', () => {
                const d = buildDiagram();
                fb.highlight({ blocks: [{ id: 'A1', state: 'current' }] });
                fb.highlight({ blocks: [{ id: 'A1', state: 'ok' }] });
                const el = d.a.findView(fb.flow.paper).el;
                expect(el.classList.contains('fb-hl-current')).false;
                expect(el.classList.contains('fb-hl-ok')).true;
                fb.clearHighlights();
                return expect(el.getAttribute('class')).not.contain('fb-hl-');
            })
            it('FB-T7 highlights are re-applied after import', () => {
                buildDiagram();
                fb.highlight({ blocks: [{ id: 'A1', state: 'error' }] });
                fb.import(JSON.stringify(fb.export()), false);
                const el = paperDiv.querySelector('[data-block-id="A1"]');
                const highlighted = el.classList.contains('fb-hl-error');
                fb.clearHighlights();
                return expect(highlighted).true;
            })
        })

        describe('FB-T8 FB-08 markers', () => {
            it('FB-T8 marker element is in block markup (left gutter)', () => {
                const b = fb.createBlock('Step', 'a', 'A1');
                const marker = paperDiv.querySelector('[data-block-id="A1"] .fb-marker');
                expect(marker).not.null;
                expect(Number(marker.getAttribute('cx'))).lt(0);
                expect(Number(marker.getAttribute('r'))).gt(0);
                // geometry is presentation only - not in model attrs (diagram saved by 1.4 = diagram saved by 1.3)
                return expect(b.attr('.fb-marker')).undefined;
            })
            it('FB-T8 marker layout follows block resize (view only)', () => {
                const b = fb.createBlock('Step', 'a', 'A1', { x: 0, y: 0 }, { width: 100, height: 100 });
                const marker = paperDiv.querySelector('[data-block-id="A1"] .fb-marker');
                const before = Number(marker.getAttribute('r'));
                b.set('size', { width: 300, height: 300 });
                expect(Number(marker.getAttribute('r'))).gt(before);
                expect(Number(marker.getAttribute('cy'))).eq(30);
                return expect(b.attr('.fb-marker')).undefined;
            })
            it('FB-T8 setMarker sets kind class and tooltip, null removes it', () => {
                fb.createBlock('Step', 'a', 'A1');
                fb.setMarker('A1', 'breakpoint-cond', 'x > 1');
                const marker = paperDiv.querySelector('[data-block-id="A1"] .fb-marker');
                expect(marker.classList.contains('fb-marker-breakpoint-cond')).true;
                expect(marker.querySelector('title').textContent).eq('x > 1');
                fb.setMarker('A1', null);
                expect(marker.classList.contains('fb-marker-breakpoint-cond')).false;
                return expect(marker.querySelector('title')).null;
            })
            it('FB-T8 marker is not serialized and does not mark dirty', () => {
                fb.createBlock('Step', 'a', 'A1');
                fb.markClean();
                fb.setMarker('A1', 'breakpoint');
                expect(JSON.stringify(fb.export())).not.contain('fb-marker');
                return expect(fb.isDirty()).false;
            })
            it('FB-T8 click on marker emits flowblocks:block-marker-click(blockId)', () => {
                fb.createBlock('Step', 'a', 'A1');
                const spy = sinon.spy();
                fb.on(EVENTS.BLOCK_MARKER_CLICK, spy);
                const marker = paperDiv.querySelector('[data-block-id="A1"] .fb-marker');
                marker.dispatchEvent(new window.MouseEvent('mousedown', { bubbles: true, clientX: 1, clientY: 1, button: 0 }));
                expect(spy.callCount).eq(1);
                return expect(spy.getCall(0).args[0]).eq('A1');
            })
            it('FB-T8 markers survive import', () => {
                buildDiagram();
                fb.setMarker('A1', 'breakpoint');
                fb.import(JSON.stringify(fb.export()), false);
                const marker = paperDiv.querySelector('[data-block-id="A1"] .fb-marker');
                const marked = marker.classList.contains('fb-marker-breakpoint');
                fb.clearMarkers();
                return expect(marked).true;
            })
            it('FB-T8 unsupported marker kind is rejected', () => {
                return expect(() => fb.flow.setMarker('A1', 'bogus')).to.throw();
            })
        })

        describe('FB-T9 FB-09a toolbar sections', () => {
            it('FB-T9 rebuildToolbar passes sections to toolbar reset', () => {
                const spy = sinon.spy();
                fb.on(EVENTS.TOOLBAR_RESET, spy);
                const sections = [{ id: 'core', label: 'Core', order: 1 }];
                fb.rebuildToolbar(TYPES, sections);
                expect(spy.getCall(0).args[1]).eq(sections);
                return expect(fb.getSections()).eq(sections);
            })
            it('FB-T9 rebuildToolbar without sections keeps legacy single argument', () => {
                const spy = sinon.spy();
                fb.on(EVENTS.TOOLBAR_RESET, spy);
                fb.rebuildToolbar(TYPES);
                return expect(spy.getCall(0).args.length).eq(1);
            })
            it('FB-T9 type section is registered', () => {
                const t = fb.registerTypes([{ name: 'KRS', template: 'PassThrough', category: 'Integrations', section: 'registries', configurables: [] }]);
                return expect(fb.getDefinition('KRS').section).eq('registries');
            })
        })

        describe('FB-T11 FB-09c declarative validation', () => {
            const RULES_TYPE = {
                name: 'Decision', template: 'Split', category: 'core', configurables: [
                    { id: 'name', label: 'Name', type: 'TEXT', required: false },
                    { id: 'variableName', label: 'Variable', type: 'IDENT', required: false }
                ],
                rules: {
                    successors: { out1: { types: ['End'], min: 1, max: 1 }, out2: { min: 0 } },
                    required: ['variableName'],
                    patterns: { variableName: { re: '^[A-Za-z_][A-Za-z0-9_]*$', msg: 'Not an identifier' } }
                }
            };
            beforeEach(() => {
                fb.registerTypes([RULES_TYPE]);
            });
            const codes = (b) => b.getStatus().errors.map(e => e.code + ':' + e.cId);
            it('FB-T11 required and pattern rules', () => {
                const b = fb.createBlock('Decision', 'd', 'D1');
                expect(codes(b)).to.include('FIELD_REQUIRED:variableName');
                b.setConfigurables([{ i: 'name', v: 'd' }, { i: 'variableName', v: '1abc' }]);
                expect(codes(b)).to.include('FIELD_PATTERN:variableName');
                expect(b.getStatus().errors.find(e => e.code == 'FIELD_PATTERN').msg).eq('Not an identifier');
                b.setConfigurables([{ i: 'name', v: 'd' }, { i: 'variableName', v: 'abc' }]);
                return expect(codes(b).filter(c => c.indexOf('FIELD_') == 0).length).eq(0);
            })
            it('FB-T11 successor min 0 makes port optional, types restrict successors', () => {
                const s = fb.createBlock('Start', 's', 'S1');
                const d = fb.createBlock('Decision', 'd', 'D1');
                const a = fb.createBlock('Step', 'a', 'A1');
                connect(s, d);
                d.setConfigurables([{ i: 'name', v: 'd' }, { i: 'variableName', v: 'abc' }]);
                expect(codes(d)).to.include('PORT_NOT_CONNECTED:out1');
                expect(codes(d)).not.to.include('PORT_NOT_CONNECTED:out2');
                connect(d, a);
                expect(codes(d)).to.include('SUCCESSOR_TYPE:out1');
                return expect(d.getStatus().valid).false;
            })
            it('FB-T11 valid when all rules pass', () => {
                const s = fb.createBlock('Start', 's', 'S1');
                const d = fb.createBlock('Decision', 'd', 'D1');
                const e = fb.createBlock('End', 'e', 'E1');
                connect(s, d);
                connect(d, e);
                d.setConfigurables([{ i: 'name', v: 'd' }, { i: 'variableName', v: 'abc' }]);
                return expect(d.getStatus().valid).true;
            })
            it('FB-T11 rules types do not use new Function (no validation source)', () => {
                const spy = sinon.spy(global, 'Function');
                const b = fb.createBlock('Decision', 'd', 'D1');
                fb.import(JSON.stringify(fb.export()), false);
                spy.restore();
                expect(fb.getDefinition('Decision').validationSrc).undefined;
                expect(b.get('_validationSource')).undefined;
                expect(fb.getBlock('D1').get('_validationRules').required).deep.eq(['variableName']);
                return expect(spy.callCount).eq(0);
            })
            it('FB-T11 validationFunction has precedence over rules (existing path unchanged)', () => {
                fb.registerTypes([Object.assign({}, RULES_TYPE, { name: 'DecisionFn', validationFunction: function (blockData) { return [{ code: 'CUSTOM', cId: 'x', msg: 'custom' }]; } })]);
                const b = fb.createBlock('DecisionFn', 'd', 'D2');
                expect(codes(b)).to.include('CUSTOM:x');
                return expect(codes(b)).not.to.include('FIELD_REQUIRED:variableName');
            })
            it('FB-T11 RegExp patterns are normalized for serialization', () => {
                fb.registerTypes([Object.assign({}, RULES_TYPE, { name: 'DecisionRe', rules: { patterns: { variableName: { re: /^a+$/i, msg: 'only a' } } } })]);
                const b = fb.createBlock('DecisionRe', 'd', 'D3');
                b.setConfigurables([{ i: 'name', v: 'd' }, { i: 'variableName', v: 'AAb' }]);
                expect(b.get('_validationRules').patterns.variableName).deep.eq({ re: '^a+$', flags: 'i', msg: 'only a' });
                return expect(codes(b)).to.include('FIELD_PATTERN:variableName');
            })
        })

        describe('FB-T13 FB-10b diff overlay', () => {
            let removedCell;
            beforeEach(() => {
                const d = buildDiagram();
                removedCell = JSON.parse(JSON.stringify(d.e.toJSON()));
                removedCell.id = 'old-cell';
                removedCell.blockId = 'OLD1';
                fb.markClean();
            });
            it('FB-T13 added/changed highlighted, removed presented as ghost', () => {
                fb.showDiff({ added: ['A1'], changed: ['S1'], removed: [removedCell] });
                expect(paperDiv.querySelector('[data-block-id="A1"]').classList.contains('fb-hl-added')).true;
                expect(paperDiv.querySelector('[data-block-id="S1"]').classList.contains('fb-hl-changed')).true;
                const ghost = paperDiv.querySelector('[data-block-id="OLD1"]');
                expect(ghost.classList.contains('fb-ghost')).true;
                expect(ghost.getAttribute('data-testid')).eq('flowblocks.block-ghost');
                return expect(fb.flow.getGhosts()[0].get('ghost')).true;
            })
            it('FB-T13 ghosts are excluded from export, getDiagram, validation and dirty tracking', async () => {
                const changed = sinon.spy();
                fb.on(EVENTS.DIAGRAM_CHANGED, changed);
                fb.showDiff({ removed: [removedCell] });
                expect(fb.export().cells.find(c => c.ghost)).undefined;
                expect(fb.getDiagram().cells.length).eq(5);
                expect(fb.flow._blocks.length).eq(3);
                expect(fb.getBlock('OLD1')).undefined;
                await wait(200);
                expect(changed.callCount).eq(0);
                return expect(fb.isDirty()).false;
            })
            it('FB-T13 ghosts are not interactive', () => {
                fb.showDiff({ removed: [removedCell] });
                const view = fb.flow.getGhosts()[0].findView(fb.flow.paper);
                return expect(view.can('elementMove')).false;
            })
            it('FB-T13 ghost id clash with existing cell is resolved', () => {
                const clash = JSON.parse(JSON.stringify(removedCell));
                clash.id = fb.getBlock('A1').id;
                fb.showDiff({ removed: [clash] });
                return expect(fb.flow.getGhosts()[0].id).eq('ghost-' + clash.id);
            })
            it('FB-T13 clearDiff removes ghosts and diff highlights, keeps other highlights', () => {
                fb.highlight({ blocks: [{ id: 'E1', state: 'error' }] });
                fb.showDiff({ added: ['A1'], removed: [removedCell] });
                fb.clearDiff();
                expect(fb.flow.graph.getCells().find(c => c.get('ghost'))).undefined;
                expect(paperDiv.querySelector('[data-block-id="A1"]').classList.contains('fb-hl-added')).false;
                expect(paperDiv.querySelector('[data-block-id="E1"]').classList.contains('fb-hl-error')).true;
                fb.clearHighlights();
                return expect(fb.isDirty()).false;
            })
        })

        describe('FB-T38 FB-13 ponowna walidacja (status zapisany w diagramie nie jest wiarygodny)', () => {
            /** Diagram jak z API: komórki bez przeliczonego statusu (status / errors podane jawnie). */
            const stale = (status, errors) => {
                const d = buildDiagram();
                const json = fb.export();
                json.cells.filter(c => c.type !== 'link').forEach(c => { c.status = status; c.statusMsg = status; c.errors = errors; });
                return { d, json };
            };
            it('FB-T38 import przelicza status klocków typów zarejestrowanych: zapisany ERROR bez błędów → OK, zapisany OK przy wolnym porcie → ERROR', () => {
                const { json } = stale('ERROR', []);
                fb.import(JSON.stringify(json), false);
                expect(['S1', 'A1', 'E1'].map(id => fb.getBlock(id).getStatus().valid)).deep.eq([true, true, true]);
                expect(fb.validate()).deep.eq({ valid: true, errorBlocks: [] });
                const lone = JSON.parse(JSON.stringify(json));
                lone.cells = lone.cells.filter(c => c.type !== 'link' && c.blockId === 'A1').map(c => Object.assign(c, { status: 'OK', statusMsg: 'OK', errors: [], _portConnections: [] }));
                fb.import(JSON.stringify(lone), false);
                const st = fb.validate();
                expect(st.valid).false;
                return expect(st.errorBlocks[0].errors.map(e => e.code)).to.include('PORT_NOT_CONNECTED');
            })
            it('FB-T38 diagram z API / szablon: połączenia tylko po stronie źródła + linki, bez statusu – po imporcie wpisy wejść z linków, klocki poprawne', () => {
                buildDiagram();
                const json = fb.export();
                json.cells.filter(c => c.type !== 'link').forEach(c => {
                    delete c.status; delete c.statusMsg; delete c.errors;
                    c._portConnections = c._portConnections.filter(x => x.port.indexOf('out') === 0).map(x => ({ port: x.port, id: x.id, targetPort: 'in1', linkId: x.linkId }));
                });
                fb.import(JSON.stringify(json), false);
                expect(fb.validate()).deep.eq({ valid: true, errorBlocks: [] });
                const a = fb.getBlock('A1').get('_portConnections');
                expect(a.map(x => [x.port, x.bId, x.type]).sort()).deep.eq([['in1', 'S1', 'Start'], ['out1', undefined, undefined]]);
                expect(fb.isDirty()).false;
                // ponowny import eksportu – bez zmian (stabilność)
                const once = JSON.stringify(fb.export().cells);
                fb.import(JSON.stringify(fb.export()), false);
                return expect(JSON.stringify(fb.export().cells)).eq(once);
            })
            it('FB-T38 import nie uruchamia funkcji walidacji (typ z funkcją, typ nieznany) – status bez zmian; diagram po imporcie czysty', () => {
                const calls = { n: 0 };
                global.__fbT38 = calls;
                const fn = function (blockData) { global.__fbT38.n++; return [{ code: 'FN', cId: 'f', msg: 'fn' }]; };
                fb.registerTypes([{ name: 'Fn', template: 'PassThrough', category: 'core', configurables: [], validationFunction: fn }]);
                fb.createBlock('Fn', 'f', 'F1');
                const json = fb.export();
                json.cells.forEach(c => { c.status = 'OK'; c.errors = []; });
                const unknown = Object.assign(JSON.parse(JSON.stringify(json.cells[0])), { id: 'u1', blockId: 'U1', _type: 'Unknown', status: 'OK' });
                delete unknown._validationSource;
                json.cells.push(unknown);
                calls.n = 0;
                fb.import(JSON.stringify(json), false);
                delete global.__fbT38;
                expect(calls.n).eq(0);
                expect([fb.getBlock('F1').getStatus().valid, fb.getBlock('U1').getStatus().valid]).deep.eq([true, true]);
                return expect(fb.isDirty()).false;
            })
            it('FB-T38 revalidate(): przelicza klocki typów zarejestrowanych (zmienione reguły), nieznany typ bez zmian; wynik jak validate(); bez oznaczenia zmiany', async () => {
                const { d } = stale('OK', []);
                fb.markClean();
                fb.registerTypes([{ name: 'Step', template: 'PassThrough', category: 'core', configurables: [{ id: 'code', label: 'Code', type: 'TEXT', required: false }], rules: { required: ['code'] } }]);
                // reguły typu działają na klocku po ponownym zastosowaniu (jak przy imporcie z typami zarejestrowanymi)
                d.a._reApplyValidation(undefined, fb.getDefinition('Step').rules);
                expect(d.a.getStatus().valid).true;
                const r = fb.revalidate();
                expect(r.valid).false;
                expect(r.errorBlocks.map(b => [b.blockId, b.errors.map(e => e.code + ':' + e.cId)])).deep.eq([['A1', ['FIELD_REQUIRED:code']]]);
                expect(r).deep.eq(fb.validate());
                expect(d.a.revalidate()).deep.eq(d.a.getStatus());
                await wait(200);
                return expect(fb.isDirty()).false;
            })
            it('FB-T38 błąd funkcji walidacji przy revalidate – klocek nieprawidłowy (VALIDATION_ERROR), błąd w konsoli', () => {
                fb.registerTypes([{ name: 'Boom', template: 'PassThrough', category: 'core', configurables: [], validationFunction: function () { return []; } }]);
                const b = fb.createBlock('Boom', 'b', 'B1');
                b.set('_validationFunction', () => { throw new Error('boom'); });
                const err = sinon.stub(console, 'error');
                try {
                    const r = fb.revalidate();
                    expect(err.calledWithMatch('Block validation failed', 'B1')).true;
                    return expect(r.errorBlocks.find(x => x.blockId === 'B1').errors.map(e => e.code)).deep.eq(['VALIDATION_ERROR']);
                } finally { err.restore(); }
            })
        })

        describe('FB-T14 regression', () => {
            it('FB-T14 export still contains types and bumps exported timestamp', () => {
                buildDiagram();
                const json = fb.export();
                expect(json.types.Step.name).eq('Step');
                return expect(json.exported).to.be.a('number');
            })
            it('FB-T14 import with types restores validation function from source', () => {
                fb.registerTypes([{ name: 'Fn', template: 'PassThrough', category: 'core', configurables: [], validationFunction: function (blockData) { return [{ code: 'FN', cId: 'f', msg: 'fn' }]; } }]);
                fb.createBlock('Fn', 'f', 'F1');
                fb.import(JSON.stringify(fb.export()), true);
                return expect(fb.getBlock('F1').getStatus().errors.map(e => e.code)).to.include('FN');
            })
        })
    })
})
