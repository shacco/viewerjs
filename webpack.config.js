require('dotenv').config();

const path = require('path');

const entrypoints = require('./.config/entrypoints');
const mode = {
    name: process.env.environment,
    isProduction: process.env.environment == 'production'
};

const stylesDir = path.resolve(__dirname, 'src/styles/');
const viewsDir = path.resolve(__dirname, 'src/views/');
const scriptsDir = path.resolve(__dirname, 'src/scripts/');
const fakersDir = path.resolve(__dirname, 'src/fakers/');
const buildDir = path.resolve(__dirname, 'build/');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');

let config = {
    mode: mode.name,
    entry: entrypoints,
    output: {
        filename: 'js/[name].js',
        path: buildDir
    },
    devServer: {
        port: 9000,
    },
    resolve: {
        alias: {
            styles: stylesDir,
            scripts: scriptsDir,
            views: viewsDir,
            fakers: fakersDir
        }
    },
    module: {
        rules: [
            {
                test: /[^faker]\.js$/,
                exclude: /(node_modules)/,
                include: scriptsDir,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
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
            },
            {
                test: mode.isProduction ? /\.handlebars$/ : /(\.faker\.js|\.handlebars)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name(file) {
                                if (mode.isProduction) {
                                    return 'views/[name].handlebars';
                                }
                                let finalName = /[\d\w_]+(\.faker\.js|\.handlebars)$/i.exec(file)[0].replace('.handlebars','.html').replace('.faker.js','.html')
                                return finalName;
                            }
                        }
                    },
                    {
                        loader: path.resolve(__dirname, '.config/loaders/handlebars.js'),
                        options: {
                            fakersDir,
                            viewsDir,
                            isProduction: mode.isProduction
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
}

if (!mode.isProduction) {
    config.devtool = 'inline-source-map';
}


module.exports = config;