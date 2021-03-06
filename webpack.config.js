'use strict';

var nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        filename: 'flowblocks.js', // <-- Important
        path: path.resolve(__dirname, 'dist'),
        // ,
        // libraryTarget: 'this' // <-- Important
        library: 'flowblocks',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    //target: 'node', // <-- Important
    // module: {
    //     rules: [
    //         {
    //             test: /\.tsx?$/,
    //             //loader: 'ts-loader',
    //             options: {
    //                 //transpileOnly: true
    //             }
    //         }
    //     ]
    // },
    resolve: {
        extensions: [ '.js' ]
    },
    externals: {jointjs: "joint"}

    // ,
    // externals: [nodeExternals({
    //     whitelist: ['paytip-module-tipbox','paytip-module-core', 'paytip-module-wallet', 'paytip-module-integration','paytip-module-integration-inbound','paytip-module-bo']
    // })] // <-- Important
};
