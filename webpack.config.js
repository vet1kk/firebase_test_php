const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        'bundle': './src/index.js',
        'firebase-messaging-sw': './src/firebase-messaging-sw.js',
    },
    output: {
        path: path.resolve(__dirname),
        filename: '[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['bundle'],
            inject: 'body',
        })
    ],
};