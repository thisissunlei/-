
var express = require('express');  
var app = express(); 
var fs = require('fs')  
var path=require('path');  
var setTemplate = require('./tool/setTemplate')

var chokidar = require('chokidar');
var minify = require('html-minifier').minify;

var templatePath = path.resolve(__dirname+'/template/page');  
var mainPath = path.resolve(__dirname+'/main'); 
var pubilcPath = path.resolve(__dirname+'/public'); 
var staticPath = path.resolve(__dirname+'/static');

const templateComponents = chokidar.watch(path.join(__dirname, '/template/components'));
const templatePage = chokidar.watch(path.join(__dirname, '/template/templatePage'));
const mainFile = chokidar.watch(path.join(__dirname, '/main'));
const staticFile = chokidar.watch(path.join(__dirname, '/static'));
 

templateComponents.on('ready', () => {
    templateComponents.on('change', (path) => {
        getMainHtml();
    });
    // watcher.on('add', (path) => {
    //     console.log('<---- watched new file add, do something ---->');
    // });
    // watcher.on('unlink', (path) => {
    //     console.log('<---- watched file remove, do something ---->');
    // });
})

templatePage.on('ready', () => {
    templatePage.on('change', (path) => {
        getMainHtml();
    });
    // watcher.on('add', (path) => {
    //     console.log('<---- watched new file add, do something ---->');
    // });
    // watcher.on('unlink', (path) => {
    //     console.log('<---- watched file remove, do something ---->');
    // });
})


mainFile.on('ready', () => {
    mainFile.on('change', (path) => {
        getMainHtml();
    });
    // watcher.on('add', (path) => {
    //     console.log('<---- watched new file add, do something ---->');
    // });
    // watcher.on('unlink', (path) => {
    //     console.log('<---- watched file remove, do something ---->');
    // });
})
staticFile.on('ready', () => {
    staticFile.on('change', (path) => {
        getMainHtml();
    });
    // watcher.on('add', (path) => {
    //     console.log('<---- watched new file add, do something ---->');
    // });
    // watcher.on('unlink', (path) => {
    //     console.log('<---- watched file remove, do something ---->');
    // });
})
//获取插件部分的内容
function getStaticContent(mainContent,fileName){
    // console.log(mainContent,"lllno")
    fs.readdir(staticPath, 'utf8', function (err,data) {  
        var result = '';
        data.forEach(function(item, index) {  
         
            result = fs.readFileSync(staticPath+'/'+item, {
                encoding: 'utf-8'
            }) 
        
            var templateReg = new RegExp('\\$\\{'+ item +'\\}', 'ig');
          
            var files = item.split('.');
            var suffix = files[files.length -1];
            if(suffix !='js' && item !=='jsCode' && item !=='allData'){
                result = minify(result,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true});
            }
            mainContent= mainContent.replace(templateReg,result)
        });  
       
        render(mainContent,fileName);
      
    });  
}
//获取主文件的内容
function getMainHtml(){
    setTemplate();
    fs.readdir(mainPath, 'utf8', function (err,data) {  
       
        data.forEach(function(item, index) {  
         
            fs.readFile(mainPath+'/'+item,'utf8',function(err,files){
              const result = files;
                // result = result.replace('${'+fileName+'}',static)
               
                 getStaticContent(result,item);

                
       
            })  
        });  
      
    });  
}
//生成模板html
function setTemplate(){

}
//获取生成查看文件
function render(templateContent,fileName){
    var templateReg = new RegExp('\\$\\{template\\}', 'ig');

    fs.readdir(templatePath, 'utf8', function (err,data) {  
      
       
        // data.forEach(function(item, index) {

            // fs.readFile(templatePath+'/'+item,'utf8',function(err,files){
            //    console.log(item,"=======")
            //     // var result = files.replace(/要替换的内容/g, '替换后的内容');
            //     var result = minify(files,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true})
            //     templateContent = templateContent.replace(templateReg,"'"+ result+"'")
            //     fs.writeFile(pubilcPath+'/'+item, templateContent, 'utf8', function (err) {
            //          if (err) return console.log(err);
            //     });
            //
            // })

          // var tempFile = fs.readFileSync(templatePath+'/'+item,'utf8');
          // console.log(item,"=======")
          // var result = minify(tempFile,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true})
          // templateContent = templateContent.replace(templateReg,"'"+ result+"'")
          // fs.writeFile(pubilcPath+'/'+item, templateContent, 'utf8', function (err) {
          //     if (err) return console.log(err);
          // });

        // });
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            fs.readFile(templatePath+'/'+item,'utf8',function(err,files){
                console.log(item,"=======")
              // var result = files.replace(/要替换的内容/g, '替换后的内容');
              const result = minify(files,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true})
            const tempCon = templateContent.replace(templateReg,"'"+ result+"'")
              // templateContent = templateContent.replace(templateReg,"'"+ result+"'")
              fs.writeFile(pubilcPath+'/'+item, tempCon, 'utf8', function (err) {
                   if (err) return console.log(err);
              });
          })
        }
    });  
}
// render();
app.listen(3000,()=>{
    console.log("server running at 127.0.0.1:3000");   
});

// app.get('/',(req,res)=>{
//     res.redirect('/render.html');     
// });
getMainHtml();
app.use(express.static('public'));
// app.use(express.static(__dirname + '/render.html'));


/**
* 这里匹配到的是/chat.html就是上面重定向到的路径。
*/
// app.get('/chat.html',(req,res)=>{
//     fs.readFile(path.join(__dirname,'./public/chat.html'),function(err,data){       //读取文件，readFile里传入的是文件路径和回调函数，这里用path.join()格式化了路径。
//         if(err){
//             console.error("读取chat.html发生错误",err);                    //错误处理
//             res.send('4 0 4');                                           //如果发生错误，向浏览器返回404
//         } else {
//             res.end(data);                  //这里的data就是回调函数的参数，在readFile内部已经将读取的数据传递给了回调函数的data变量。
//         }                                    //我们将data传到浏览器，就是把html文件传给浏览器
//     })
// });
