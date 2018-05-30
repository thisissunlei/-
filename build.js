
var express = require('express');  
var app = express(); 
var fs = require('fs')  
var path=require('path');  

var chokidar = require('chokidar');
var minify = require('html-minifier').minify;

var templatePath = path.resolve(__dirname+'/template');  
var mainPath = path.resolve(__dirname+'/main'); 
var pubilcPath = path.resolve(__dirname+'/public'); 
var staticPath = path.resolve(__dirname+'/static');

const templateFile = chokidar.watch(path.join(__dirname, '/template'));
const mainFile = chokidar.watch(path.join(__dirname, '/main'));
const staticFile = chokidar.watch(path.join(__dirname, '/main'));
 
//获取插件部分的内容
function getStaticContent(mainContent,fileName){
    // console.log(mainContent,"lllno")
    fs.readdir(staticPath, 'utf8', function (err,data) {  
        var result = '';
        data.forEach(function(item, index) {  
          
         
            result = fs.readFileSync(staticPath+'/'+item, {
                encoding: 'utf-8'
            }) 
            var splitStr = item;
          
            var templateReg = new RegExp('\\$\\{'+ splitStr +'\\}', 'ig');
          
            var files = item.split('.');
            var suffix = files[files.length -1];
            if(suffix =='html'){
                result = minify(result,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true});
            }
            console.log(files,"ppppppp")
            if(item.indexOf('.')>-1){
                mainContent= mainContent.replace(templateReg,result);
            }
           
           
        });  
       
        render(mainContent,fileName);
      
    });  
}
//获取主文件的内容
function getMainHtml(){
    fs.readdir(mainPath, 'utf8', function (err,data) {  
       
        data.forEach(function(item, index) {  
         
            fs.readFile(mainPath+'/'+item,'utf8',function(err,files){  
                var result =  files;
                // result = result.replace('${'+fileName+'}',static)
                console.log(result,"kkkkkk")
                 getStaticContent(result,item);
                
                
       
            })  
        });  
      
    });  
}
//获取生成查看文件
function render(templateContent,fileName){
    var templateReg = new RegExp('\\$\\{template\\}', 'ig');
    fs.readdir(templatePath, 'utf8', function (err,data) {  
      
       
        data.forEach(function(item, index) {  
          
            fs.readFile(templatePath+'/'+item,'utf8',function(err,files){  
                console.log("pppppppp")
                // var result = files.replace(/要替换的内容/g, '替换后的内容');  
                var result = minify(files,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true})
                // templateContent = templateContent.replace(templateReg,result)
                fs.writeFile(pubilcPath+'/build-'+item, templateContent, 'utf8', function (err) {  
                     if (err) return console.log(err);  
                });  
       
            })  
        });  
      
    });  
}
getMainHtml();
// app.use(express.static('public'));

