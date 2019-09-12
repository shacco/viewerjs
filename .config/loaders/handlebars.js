const handlebars = require('handlebars');
const fs = require('fs');
const {getOptions} = require('loader-utils');
const path = require('path');
const clearRequire = require('clear-require');

module.exports = function (part) {
    const options = getOptions(this);
    if (options.isProduction) {
        return part;
    }
    const fakerDir = options.fakersDir ? options.fakersDir : path.resolve(__dirname, 'build/scripts/');
    const viewsDir = options.viewsDir ? options.viewsDir : path.resolve(__dirname, 'src/views/');

    const currentTargetIsHandlebars = /\.handlebars$/.test(this.resourcePath);
    if(currentTargetIsHandlebars){
        const template = handlebars.compile(part);
        const finalPath = this.resourcePath.replace(viewsDir, fakerDir).replace('.handlebars', '.faker.js');
        const html = template(require(finalPath)());
        clearRequire(finalPath);
        return html;
    }else{
        const handlebarsFileDir = this.resourcePath.replace(fakerDir,viewsDir).replace('.faker.js','.handlebars');
        const time = new Date();
        fs.utimesSync(handlebarsFileDir, time, time);
        return false;
        // const viewContent =fs.readFileSync(handlebarsFileDir);
        // const template = handlebars.compile(viewContent);
        // const html = template(require(this.resourcePath)());
        // clearRequire(this.resourcePath);
        // return html;
    }





}