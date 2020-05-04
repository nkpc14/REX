var path = require('path');
var webpack = require('webpack');
module.exports = {
    mode: "development",
    entry: './frontend/scripts/client.js',
    output: {
        path: path.resolve(__dirname, 'frontend', 'scripts'),
        filename: 'bundle.js',
        publicPath: '/frontend/scripts'
    },
    module: {
        rules: [{
            test: '/\.js$',
            exclude: '/(node_modules|bower_components)/',
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                plugins: [
                    '@babel/plugin-proposal-object-rest-spread',
                    '@babel/plugin-transform-classes',
                    '@babel/plugin-transform-arrow-functions',
                    '@babel/plugin-proposal-class-properties'
                ]
            }
        }]
    },
    plugins: []
};