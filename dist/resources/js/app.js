
var flow = flowblocks.createFlow('flowblocks-flow');
var toolbar = flowblocks.createToolbar('flowblocks-toolbar');
var app = flowblocks.createApp('flowblocks-flow', 'flowblocks-toolbar', 'flowblocks-menu', {
    b: 'https://bulma.io/images/bulma-logo.png',
    u: '#',
    c: flow.graph.get('name'),
    s: 'v. ' + flowblocks.version,
    m: [
        { s: true },
        // {
        //     s: false, l: 'Types', m: [
        //         { s: false, l: 'Register type', e: 'type:create' }
        //     ]
        // },
        {
            s: false, l: 'Model spec.', m: [
                { s: false, l: 'Save', e: 'flowblocks:save' },
                { s: true },
                { s: false, l: 'Download', e: 'flowblocks:download' },
            ]
        }
    ]
});

//typeName, templateName, icon, defaultStyle, typeConfigurable, typeCategory
var types = [
    {
        name: 'Input',
        category: 'Basic',
        template: 'Start',
        icon: 'agave',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'sparse', label: 'Is placeholder sparse', placeholder: 'true, false', type: 'BOOLEAN', required: false }
        ],
        validationFunction: function (blockData) {
            var connected = blockData.connection('out1');
            
            if(connected && connected.type == 'Conv2D'){
                var inputShapeString = blockData.configurable('inputShape');
                var inputShape = JSON.parse(inputShapeString);
                console.log(inputShape);
            }
            
            return [
                { code: 'CODE', cId: 'port7', msg: 'Something went wrong' }
            ];
        }
    },
    {
        name: 'Activation',
        category: 'Basic',
        template: 'PassThrough',
        icon: 'avocado',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'activation', label: 'Activation function', placeholder: '', type: 'LIST', required: false, options: [{ v: 'elu', l: 'elu' }, { v: 'hardSigmoid', l: 'hardSigmoid' }, { v: 'linear', l: 'linear' }, { v: 'relu', l: 'relu' }, { v: 'relu6', l: 'relu6' }, , { v: 'selu', l: 'selu' }, { v: 'sigmoid', l: 'sigmoid' }, { v: 'softmax', l: 'softmax' }, { v: 'softplus', l: 'softplus' }, { v: 'softsign', l: 'softsign' }, { v: 'tanh', l: 'tanh' }], default: '-1' },
            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ],
        validationFunction: function (blockData) {
            
            
            // console.log(blockData);
            // console.log(blockData.configurable('name'))
            // console.log(blockData.connection('in1'))

            return [
                { code: 'CODE', cId: 'port7', msg: 'Something went wrong' }
            ];
        }
    },
    {
        name: 'Dense',
        category: 'Basic',
        template: 'PassThrough',
        icon: 'burrito',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'units', label: 'Units', placeholder: 'i.e. 4', type: 'NUMBER', required: false },
            { id: 'activation', label: 'Activation function', placeholder: '', type: 'LIST', required: false, options: [{ v: 'elu', l: 'elu' }, { v: 'hardSigmoid', l: 'hardSigmoid' }, { v: 'linear', l: 'linear' }, { v: 'relu', l: 'relu' }, { v: 'relu6', l: 'relu6' }, , { v: 'selu', l: 'selu' }, { v: 'sigmoid', l: 'sigmoid' }, { v: 'softmax', l: 'softmax' }, { v: 'softplus', l: 'softplus' }, { v: 'softsign', l: 'softsign' }, { v: 'tanh', l: 'tanh' }], default: '-1' },
            { id: 'useBias', label: 'Apply bias', placeholder: 'true, false', type: 'BOOLEAN', required: false },
            { id: 'kernelInitializer', label: 'Kernal initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: '-1' },
            { id: 'biasInitializer', label: 'Bias initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: '-1' },
            { id: 'inputDim', label: 'Input shape', placeholder: 'i.e. 3', type: 'NUMBER', required: false },
            { id: 'kernelConstraint', label: 'Kernel constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: '-1' },
            { id: 'biasConstraint', label: 'Bias constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: '-1' },
            { id: 'kernelRegularizer', label: 'Kernel regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'biasRegularizer', label: 'Bias regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'activityRegularizer', label: 'Activity regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Dropout',
        category: 'Basic',
        template: 'PassThrough',
        icon: 'cactus',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },

            { id: 'rate', label: 'Fraction to drop', placeholder: 'i.e. 0.2', type: 'NUMBER', required: false },
            { id: 'noiseShape', label: 'Binary dropout shape', placeholder: 'i.e. [3]', type: 'TEXT', required: false },
            { id: 'seed', label: 'Random seed', placeholder: 'i.e. 23', type: 'NUMBER', required: false },
            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Embedding',
        category: 'Basic',
        template: 'PassThrough',
        icon: 'candle',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'inputDim', label: 'Vocabulary size', placeholder: 'i.e. 7', type: 'NUMBER', required: false },
            { id: 'outputDim', label: 'Dense embedding dimension', placeholder: 'i.e. 7', type: 'NUMBER', required: false },
            { id: 'embeddingsInitializer', label: 'Embeddings initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: '-1' },
            { id: 'embeddingsRegularizer', label: 'Embeddings regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'activityRegularizer', label: 'Activation regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'embeddingsConstraint', label: 'Embedding constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: '-1' },
            { id: 'maskZero', label: 'Masking', placeholder: 'true, false', type: 'BOOLEAN', required: false },
            { id: 'inputLength', label: 'Input length', placeholder: 'i.e. 7 or [7,12]', type: 'TEXT', required: false },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Flatten',
        category: 'Basic',
        template: 'PassThrough',
        icon: 'chili',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'dataFormat', label: 'Data format', placeholder: '', type: 'LIST', required: false, options: [{ v: 'channelsFirst', l: 'channelsFirst' }, { v: 'channelsLast', l: 'channelsLast' }], default: '-1' },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Permute',
        category: 'Basic',
        template: 'PassThrough',
        icon: 'cigar',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'dims', label: 'Permutation pattern', placeholder: 'i.e. [2, 1]', type: 'TEXT', required: false },


            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Repeat Vector',
        category: 'Basic',
        template: 'PassThrough',
        icon: 'coa-de-jima',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'n', label: 'Times to repeat', placeholder: 'i.e. 2', type: 'NUMBER', required: false },


            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Reshape',
        category: 'Basic',
        template: 'PassThrough',
        icon: 'dalia',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'targetShape', label: 'Target shape', placeholder: 'i.e. [2,4,3]', type: 'TEXT', required: false },


            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Conv1D',
        category: 'Convolutional',
        template: 'PassThrough',
        icon: 'drum',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'filters', label: 'Output dimensionality', placeholder: 'i.e. 4', type: 'NUMBER', required: false },
            { id: 'kernelSize', label: 'Convolution window dimensions', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'strides', label: 'Strides of convolution', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'padding', label: 'Padding mode', placeholder: '', type: 'LIST', required: false, options: [{ v: 'valid', l: 'valid' }, { v: 'same', l: 'same' }, { v: 'causal', l: 'causal' }], default: '-1' },
            { id: 'dataFormat', label: 'Data format', placeholder: '', type: 'LIST', required: false, options: [{ v: 'channelsFirst', l: 'channelsFirst' }, { v: 'channelsLast', l: 'channelsLast' }], default: '-1' },
            { id: 'dilationRate', label: 'Dilation rate', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'activation', label: 'Activation function', placeholder: '', type: 'LIST', required: false, options: [{ v: 'elu', l: 'elu' }, { v: 'hardSigmoid', l: 'hardSigmoid' }, { v: 'linear', l: 'linear' }, { v: 'relu', l: 'relu' }, { v: 'relu6', l: 'relu6' }, , { v: 'selu', l: 'selu' }, { v: 'sigmoid', l: 'sigmoid' }, { v: 'softmax', l: 'softmax' }, { v: 'softplus', l: 'softplus' }, { v: 'softsign', l: 'softsign' }, { v: 'tanh', l: 'tanh' }], default: '-1' },
            { id: 'useBias', label: 'Apply bias', placeholder: 'true, false', type: 'BOOLEAN', required: false },
            { id: 'kernelInitializer', label: 'Kernel initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: '-1' },
            { id: 'biasInitializer', label: 'Bias initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: '-1' },
            { id: 'kernelConstraint', label: 'Kernel constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: '-1' },
            { id: 'biasConstraint', label: 'Bias constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: '-1' },
            { id: 'kernelRegularizer', label: 'Kernel regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'biasRegularizer', label: 'Bias regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'activityRegularizer', label: 'Activity regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Conv2D',
        category: 'Convolutional',
        template: 'PassThrough',
        icon: 'fajita',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'filters', label: 'Output dimensionality', placeholder: 'i.e. 4', type: 'NUMBER', required: false },
            { id: 'kernelSize', label: 'Convolution window dimensions', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'strides', label: 'Strides of convolution', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'padding', label: 'Padding mode', placeholder: '', type: 'LIST', required: false, options: [{ v: 'valid', l: 'valid' }, { v: 'same', l: 'same' }, { v: 'causal', l: 'causal' }], default: '-1' },
            { id: 'dataFormat', label: 'Data format', placeholder: '', type: 'LIST', required: false, options: [{ v: 'channelsFirst', l: 'channelsFirst' }, { v: 'channelsLast', l: 'channelsLast' }], default: '-1' },
            { id: 'dilationRate', label: 'Dilation rate', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'activation', label: 'Activation function', placeholder: '', type: 'LIST', required: false, options: [{ v: 'elu', l: 'elu' }, { v: 'hardSigmoid', l: 'hardSigmoid' }, { v: 'linear', l: 'linear' }, { v: 'relu', l: 'relu' }, { v: 'relu6', l: 'relu6' }, , { v: 'selu', l: 'selu' }, { v: 'sigmoid', l: 'sigmoid' }, { v: 'softmax', l: 'softmax' }, { v: 'softplus', l: 'softplus' }, { v: 'softsign', l: 'softsign' }, { v: 'tanh', l: 'tanh' }], default: '-1' },
            { id: 'useBias', label: 'Apply bias', placeholder: 'true, false', type: 'BOOLEAN', required: false },
            { id: 'kernelInitializer', label: 'Kernel initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: '-1' },
            { id: 'biasInitializer', label: 'Bias initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: '-1' },
            { id: 'kernelConstraint', label: 'Kernel constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: '-1' },
            { id: 'biasConstraint', label: 'Bias constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: '-1' },
            { id: 'kernelRegularizer', label: 'Kernel regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'biasRegularizer', label: 'Bias regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'activityRegularizer', label: 'Activity regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Conv2DTranspose',
        category: 'Convolutional',
        template: 'PassThrough',
        icon: 'guitar',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'filters', label: 'Output dimensionality', placeholder: 'i.e. 4', type: 'NUMBER', required: false },
            { id: 'kernelSize', label: 'Convolution window dimensions', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'strides', label: 'Strides of convolution', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'padding', label: 'Padding mode', placeholder: '', type: 'LIST', required: false, options: [{ v: 'valid', l: 'valid' }, { v: 'same', l: 'same' }, { v: 'causal', l: 'causal' }], default: '-1' },
            { id: 'dataFormat', label: 'Data format', placeholder: '', type: 'LIST', required: false, options: [{ v: 'channelsFirst', l: 'channelsFirst' }, { v: 'channelsLast', l: 'channelsLast' }], default: '-1' },
            { id: 'dilationRate', label: 'Dilation rate', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'activation', label: 'Activation function', placeholder: '', type: 'LIST', required: false, options: [{ v: 'elu', l: 'elu' }, { v: 'hardSigmoid', l: 'hardSigmoid' }, { v: 'linear', l: 'linear' }, { v: 'relu', l: 'relu' }, { v: 'relu6', l: 'relu6' }, , { v: 'selu', l: 'selu' }, { v: 'sigmoid', l: 'sigmoid' }, { v: 'softmax', l: 'softmax' }, { v: 'softplus', l: 'softplus' }, { v: 'softsign', l: 'softsign' }, { v: 'tanh', l: 'tanh' }], default: '-1' },
            { id: 'useBias', label: 'Apply bias', placeholder: 'true, false', type: 'BOOLEAN', required: false },
            { id: 'kernelInitializer', label: 'Kernel initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: '-1' },
            { id: 'biasInitializer', label: 'Bias initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: '-1' },
            { id: 'kernelConstraint', label: 'Kernel constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: '-1' },
            { id: 'biasConstraint', label: 'Bias constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: '-1' },
            { id: 'kernelRegularizer', label: 'Kernel regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'biasRegularizer', label: 'Bias regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'activityRegularizer', label: 'Activity regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Conv3D',
        category: 'Convolutional',
        template: 'PassThrough',
        icon: 'jam',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
            { id: 'filters', label: 'Output dimensionality', placeholder: 'i.e. 4', type: 'NUMBER', required: false },
            { id: 'kernelSize', label: 'Convolution window dimensions', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'strides', label: 'Strides of convolution', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'padding', label: 'Padding mode', placeholder: '', type: 'LIST', required: false, options: [{ v: 'valid', l: 'valid' }, { v: 'same', l: 'same' }, { v: 'causal', l: 'causal' }], default: '-1' },
            { id: 'dataFormat', label: 'Data format', placeholder: '', type: 'LIST', required: false, options: [{ v: 'channelsFirst', l: 'channelsFirst' }, { v: 'channelsLast', l: 'channelsLast' }], default: '-1' },
            { id: 'dilationRate', label: 'Dilation rate', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'activation', label: 'Activation function', placeholder: '', type: 'LIST', required: false, options: [{ v: 'elu', l: 'elu' }, { v: 'hardSigmoid', l: 'hardSigmoid' }, { v: 'linear', l: 'linear' }, { v: 'relu', l: 'relu' }, { v: 'relu6', l: 'relu6' }, , { v: 'selu', l: 'selu' }, { v: 'sigmoid', l: 'sigmoid' }, { v: 'softmax', l: 'softmax' }, { v: 'softplus', l: 'softplus' }, { v: 'softsign', l: 'softsign' }, { v: 'tanh', l: 'tanh' }], default: '-1' },
            { id: 'useBias', label: 'Apply bias', placeholder: 'true, false', type: 'BOOLEAN', required: false },
            { id: 'kernelInitializer', label: 'Kernel initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: '-1' },
            { id: 'biasInitializer', label: 'Bias initializer', placeholder: '', type: 'LIST', required: false, options: [{ v: 'constant', l: 'constant' }, { v: 'glorotNormal', l: 'glorotNormal' }, { v: 'glorotUniform', l: 'glorotUniform' }, { v: 'heNormal', l: 'heNormal' }, { v: 'heUniform', l: 'heUniform' }, { v: 'identity', l: 'identity' }, { v: 'leCunNormal', l: 'leCunNormal' }, { v: 'leCunUniform', l: 'leCunUniform' }, { v: 'ones', l: 'ones' }, { v: 'orthogonal', l: 'orthogonal' }, { v: 'randomNormal', l: 'randomNormal' }, { v: 'randomUniform', l: 'randomUniform' }, { v: 'truncatedNormal', l: 'truncatedNormal' }, { v: 'varianceScaling', l: 'varianceScaling' }, { v: 'zeros', l: 'zeros' }], default: '-1' },
            { id: 'kernelConstraint', label: 'Kernel constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: '-1' },
            { id: 'biasConstraint', label: 'Bias constraint', placeholder: '', type: 'LIST', required: false, options: [{ v: 'maxNorm', l: 'maxNorm' }, { v: 'minMaxNorm', l: 'minMaxNorm' }, { v: 'nonNeg', l: 'nonNeg' }, { v: 'unitNorm', l: 'unitNorm' }], default: '-1' },
            { id: 'kernelRegularizer', label: 'Kernel regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'biasRegularizer', label: 'Bias regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },
            { id: 'activityRegularizer', label: 'Activity regularizer', placeholder: 'i.e. l1l2', type: 'TEXT', required: false },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Cropping2D',
        category: 'Convolutional',
        template: 'PassThrough',
        icon: 'maracas',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },

            { id: 'cropping', label: 'Dimension of the cropping', placeholder: 'i.e. [2,1]', type: 'TEXT', required: false },
            { id: 'dataFormat', label: 'Data format', placeholder: '', type: 'LIST', required: false, options: [{ v: 'channelsFirst', l: 'channelsFirst' }, { v: 'channelsLast', l: 'channelsLast' }], default: '-1' },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Add',
        category: 'Merge',
        template: 'PassThrough',
        icon: 'mask',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Average',
        category: 'Merge',
        template: 'PassThrough',
        icon: 'mate',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },


            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Concatenate',
        category: 'Merge',
        template: 'PassThrough',
        icon: 'mexican-hat',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },

            { id: 'axis', label: 'Axis', placeholder: 'i.e. 0', type: 'NUMBER', required: false },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Dot Product',
        category: 'Merge',
        template: 'PassThrough',
        icon: 'mexican',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },

            { id: 'axes', label: 'Axes', placeholder: 'i.e. [0,0]', type: 'TEXT', required: false },
            { id: 'normalize', label: 'L2-Normalize', placeholder: 'true, false', type: 'BOOLEAN', required: false },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Maximum',
        category: 'Merge',
        template: 'PassThrough',
        icon: 'molcajete',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },


            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Minimum',
        category: 'Merge',
        template: 'PassThrough',
        icon: 'mustache',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },


            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Multiply',
        category: 'Merge',
        template: 'PassThrough',
        icon: 'nachos',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },


            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Avg Pooling 1D',
        category: 'Pooling',
        template: 'PassThrough',
        icon: 'piata',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },

            { id: 'poolSize', label: 'Pool over window size', placeholder: 'i.e. [1]', type: 'TEXT', required: false },
            { id: 'strides', label: 'Sampling period', placeholder: 'i.e. [1]', type: 'TEXT', required: false },
            { id: 'padding', label: 'Padding mode', placeholder: '', type: 'LIST', required: false, options: [{ v: 'valid', l: 'valid' }, { v: 'same', l: 'same' }, { v: 'causal', l: 'causal' }], default: '-1' },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    },
    {
        name: 'Avg Pooling 2D',
        category: 'Pooling',
        template: 'PassThrough',
        icon: 'poncho',
        style: 'cream',
        configurables: [
            { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },

            { id: 'poolSize', label: 'Pool over window size', placeholder: 'i.e. [1,1]', type: 'TEXT', required: false },
            { id: 'strides', label: 'Sampling period', placeholder: 'i.e. [1,1]', type: 'TEXT', required: false },
            { id: 'padding', label: 'Padding mode', placeholder: '', type: 'LIST', required: false, options: [{ v: 'valid', l: 'valid' }, { v: 'same', l: 'same' }, { v: 'causal', l: 'causal' }], default: '-1' },
            { id: 'dataFormat', label: 'Data format', placeholder: '', type: 'LIST', required: false, options: [{ v: 'channelsFirst', l: 'channelsFirst' }, { v: 'channelsLast', l: 'channelsLast' }], default: '-1' },

            { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
            { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
            { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
            { id: 'trainable', label: 'Weights updatable', placeholder: 'true, false', type: 'BOOLEAN', required: false },
        ]
    }

]

flowblocks.registerTypes(types);

flowblocks.registerType('SiakisInny', 'Start', 'tequila', 'cream',
    [
        { id: 'name', label: 'Layer name', placeholder: 'i.e. my input', type: 'TEXT', required: false },
        { id: 'inputShape', label: 'Input shape', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
        { id: 'batchSize', label: 'Input batch size', placeholder: 'i.e. 250', type: 'NUMBER', required: false },
        { id: 'batchInputShape', label: 'Batch input size', placeholder: 'i.e. [4]', type: 'TEXT', required: false },
        { id: 'dtype', label: 'Input datatype', placeholder: '', type: 'LIST', required: false, options: [{ v: 'float32', l: 'float32' }, { v: 'int32', l: 'int32' }, { v: 'bool', l: 'bool' }, { v: 'complex64', l: 'complex64' }, { v: 'string', l: 'string' }], default: '-1' },
        { id: 'sparse', label: 'Is placeholder sparse', placeholder: 'true, false', type: 'BOOLEAN', required: false }
    ]
    , 'Input');


flowblocks.enablePanAndZoom(svgPanZoom);