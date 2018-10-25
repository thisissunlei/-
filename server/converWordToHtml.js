
/**
 * @desc: world文档转换成html并对文章内容做一定的处理
 * @author: 刘毅豪(liuyihao@krspace.cn) or 王乐平(wangleping@krspace.cn)
 */
var mammoth = require("mammoth");
var fs = require('fs');
var path = require('path');
const version = '2018-10';
var files = fs.readdirSync('./doc/'+version);
function writeFileFun(i, result) {
  return new Promise((resolve, reject) => {
    fs.writeFile('convertTemplate/'+version+'/' + i + '.html', result.value, 'utf8', function (err) {
      if (err) return reject(err);
      return resolve(result.messages);
    });
  })
}

const promiseList = files.map(i => new Promise((resolve, reject) => {
  console.log(i,"pppp")
  return resolve(mammoth.convertToHtml({path: `doc/${version+'/'+i}`}));
}).then(result => {
  // console.log(result,"oooo")
  result.value = getAgreement(result.value);
  return writeFileFun(i, result)
}));

Promise.all(promiseList).then((result) => {
 
}).catch((error) => {
  console.log('error: ' + error)
})

function getAgreement(file){
  
  if(file.indexOf('<p><strong>第二部分 条款和条件</strong></p>')!=-1){
    file = file.split('<p><strong>第二部分 条款和条件</strong></p>')[1]
  }
  return file;
}