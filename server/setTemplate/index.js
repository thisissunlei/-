
const express = require('express');
const fs = require('fs')
const path = require('path');

const minify = require('html-minifier').minify;
const componentsPath = path.resolve(__dirname, '../../client/template/components');  //组件路径
const templatePagePath = path.resolve(__dirname, '../../client/template/templatePage'); //页面模块路径
const pagePath = path.resolve(__dirname, '../../client/template/page'); // 生成文件存放的路径

//获取components文件夹的文件内容  公共组件部分
function getComponents(templateFile,templateName) {
  let data = fs.readdirSync(componentsPath, 'utf8');
  data.forEach(function (item, index) {
    let templateReg = new RegExp('\\$\\{' + item + '\\}', 'ig');
    let files = fs.readFileSync(componentsPath + '/' + item, 'utf8')
    templateFile = templateFile.replace(templateReg, files)
    templateFile = minify(templateFile, { removeComments: true, collapseWhitespace: true, minifyCSS: true });

    fs.writeFileSync(pagePath + '/' + templateName, templateFile, 'utf8');
 
  });
}

function render() {
  let data = fs.readdirSync(templatePagePath, 'utf8');
  data.forEach(function (item) {
    const files = fs.readFileSync(templatePagePath + '/' + item, 'utf8')
    getComponents(files,item)
  });
}
module.exports = render;