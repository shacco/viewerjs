const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require('dotenv').config();

const entry = require('./.config/entrypoints');
const mode = {
    name: process.env.environment,
    isProduction: process.env.environment == 'production'
};

let config = {
    mode:mode.name,
    entry,
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'build')
    },
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                include: path.resolve(__dirname, './src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory:true,
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: "css/[name].css",
                        },
                    },
                    'extract-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: !mode.isProduction,
                        },
                    },
                ],
            }
        ]
    },
};


if(!mode.isProduction){
    config.devtool='inline-source-map';
}


module.exports = config;