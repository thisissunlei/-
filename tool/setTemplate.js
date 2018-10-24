
var express = require('express');
var fs = require('fs')
var path = require('path');

var minify = require('html-minifier').minify;
var componentsPath = path.resolve(__dirname, '../template/components');  //组件路径
var templatePagePath = path.resolve(__dirname, '../template/templatePage'); //页面模块路径
var pagePath = path.resolve(__dirname, '../template/page'); // 生成文件存放的路径

//获取components文件夹的文件内容  公共组件部分
function getComponents(templateFile,templateName) {
  var data = fs.readdirSync(componentsPath, 'utf8');
  data.forEach(function (item, index) {
    
    let templateReg = new RegExp('\\$\\{' + item + '\\}', 'ig');
    var files = fs.readFileSync(componentsPath + '/' + item, 'utf8')
    
    templateFile = templateFile.replace(templateReg, files)

    templateFile = minify(templateFile, { removeComments: true, collapseWhitespace: true, minifyCSS: true });

    fs.writeFileSync(pagePath + '/' + templateName, templateFile, 'utf8');
 
  });

}

function render() {
  var data = fs.readdirSync(templatePagePath, 'utf8');

  data.forEach(function (item) {
    const files = fs.readFileSync(templatePagePath + '/' + item, 'utf8')
  
    getComponents(files,item)
  });
}



module.exports = render;