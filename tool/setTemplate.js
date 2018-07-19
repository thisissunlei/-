
var express = require('express');  
var app = express(); 
var fs = require('fs')  
var path=require('path');  
var minify = require('html-minifier').minify;

var componentsPath = path.resolve(__dirname,'../template/components');  //模板路径组件路径
var templatePagePath = path.resolve(__dirname,'../template/templatePage');  
var pagePath = path.resolve(__dirname,'../template/page');  



function getComponents(){
    var templateReg = new RegExp('\\$\\{template\\}', 'ig');
    var data = fs.readdirSync(componentsPath, 'utf8');
    data.forEach(function(item, index) {  
        var files =  fs.readFileSync(componentsPath+'/'+item,'utf8')
        render(files,item)
        
    });  
      
}
function render(componentsFils,componentsName,){
    var templateReg = new RegExp('\\$\\{'+componentsName+'\\}', 'ig');
    var data = fs.readdirSync(templatePagePath, 'utf8');

    data.forEach(function(item, index) {  
        const files =  fs.readFileSync(templatePagePath+'/'+item,'utf8')

        let templateFiles = files.replace(templateReg,componentsFils)
        templateFiles = minify(templateFiles,{removeComments: true,collapseWhitespace: true,minifyCSS:true});   
        
        fs.writeFileSync(pagePath+'/'+item, templateFiles, 'utf8');  
        
    });  
      
    console.log("000000000")
}



module.exports = getComponents;