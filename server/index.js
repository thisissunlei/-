
var express = require('express');
var app = express();
var fs = require('fs')
var path = require('path');
var setTemplate = require('./setTemplate')
var renderMainTabel = require('./renderMainTabel');
var postLogin = require('./postLogin');

var chokidar = require('chokidar');
var minify = require('html-minifier').minify;

var templatePath = path.join(__dirname, '../template/page');
var mainPath = path.join(__dirname,'../main'); //主js文件
var pubilcPath = path.join(__dirname, '../public'); //预览文件生成路径
var staticPath = path.join(__dirname,'../static'); // 插件部分内容
console.log(staticPath,"ppppp")
const templateComponents = chokidar.watch(path.join(__dirname, '/template/components')); //组件文件加修改监听
const templatePage = chokidar.watch(path.join(__dirname, '/template/templatePage')); //html模板文件加添加监听

const mainFile = chokidar.watch(path.join(__dirname, '../main')); //主js文件添加监听
const staticFile = chokidar.watch(path.join(__dirname, '../static')); //公共部分添加监听



templateComponents.on('ready', () => {
  templateComponents.on('change', (path) => {
    getMainHtml();
  });
})

templatePage.on('ready', () => {
  templatePage.on('change', (path) => {
    getMainHtml();
  });
})


mainFile.on('ready', () => {
  mainFile.on('change', (path) => {
    getMainHtml();
  });
})

staticFile.on('ready', () => {
  staticFile.on('change', (path) => {
    getMainHtml();
  });
})


//获取插件部分的内容
function getStaticContent(mainContent, fileName) {
  //读取static文件夹
  fs.readdir(staticPath, 'utf8', function (err, data) {

    var result = '';
    data.forEach(function (item, index) {
      //同步读取里每个文件的内容
      result = fs.readFileSync(staticPath + '/' + item, {
        encoding: 'utf-8'
      })
      //分别替换 css jq jsCode allData 部分内容
      var templateReg = new RegExp('\\$\\{' + item + '\\}', 'ig');

      var files = item.split('.');
      var suffix = files[files.length - 1];

      if (suffix != 'js' && item !== 'jsCode' && item !== 'allData') {
        result = minify(result, { removeComments: true, collapseWhitespace: true, minifyJS: true, minifyCSS: true });
      }

      mainContent = mainContent.replace(templateReg, result)
    });

    render(mainContent, fileName);

  });
}

//获取主文件的内容
function getMainHtml() {
  setTemplate()
  postLogin();
 
  //获取去main文件的所有文件的路径
  fs.readdir(mainPath, 'utf8', function (err, data) {
   
    
    data.forEach(function (item, index) {
      //读取main文件夹下多有文件的内容
      fs.readFile(mainPath + '/' + item, 'utf8', function (err, files) {
        const result = files;
        getStaticContent(result, item);
      })
    });

  });
}

//获取生成查看文件
function render(templateContent, fileName) {
  var templateReg = new RegExp('\\$\\{template\\}', 'ig');
  fs.readdir(templatePath, 'utf8', function (err, data) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      fs.readFile(templatePath + '/' + item, 'utf8', function (err, files) {

        const result = minify(files, { removeComments: true, collapseWhitespace: true, minifyJS: true, minifyCSS: true })
        const tempCon = templateContent.replace(templateReg, "'" + result + "'")
        fs.writeFile(pubilcPath + '/' + item, tempCon, 'utf8', function (err) {
          if (err) return console.log(err);
        });
      })
    }
  });
}
// render();
app.listen(3000, () => {
  console.log("server running at 127.0.0.1:3000");
});



getMainHtml();
renderMainTabel();
app.use(express.static('public'));
