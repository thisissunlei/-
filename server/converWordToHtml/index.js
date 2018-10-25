
/**
 * @desc: world文档转换成html并对文章内容做一定的处理
 * @author: 刘毅豪(liuyihao@krspace.cn) or 王乐平(wangleping@krspace.cn)
 */
const mammoth = require("mammoth");
const fs = require('fs');
const config = require('../config');
const version = config.version;
const files = fs.readdirSync('docToHtml/doc/'+version);
function writeFileFun(i, result) {
  return new Promise((resolve, reject) => {
    fs.writeFile('docToHtml/convertTemplate/'+version+'/' + i + '.html', result.value, 'utf8', function (err) {
      if (err) return reject(err);
      return resolve(result.messages);
    });
  })
}

const promiseList = files.map(i => new Promise((resolve, reject) => {
  return resolve(mammoth.convertToHtml({path: `docToHtml/doc/${version+'/'+i}`}));
}).then(result => {
  
  result.value = getAgreement(result.value);
  return writeFileFun(i, result)
}));

Promise.all(promiseList).then((result) => {
 
}).catch((error) => {
  console.log('error: ' + error)
})
//将数据以 <p><strong>第二部分 条款和条件</strong></p> 为分界，进行分割

function getAgreement(file){
  if(file.indexOf('<p><strong>第二部分 条款和条件</strong></p>')!=-1){
    file = file.split('<p><strong>第二部分 条款和条件</strong></p>')[1]
  }
  return file;
}