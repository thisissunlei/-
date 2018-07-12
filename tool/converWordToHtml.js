var mammoth = require("mammoth");
var fs = require('fs');
var path = require('path');

var filePath = path.resolve('../doc');
var files = fs.readdirSync('./doc');

// console.log('file文件: ', files);
function writeFileFun(i, result) {
  return new Promise((resolve, reject) => {
    fs.writeFile('convertTemplate/' + i + '.html', result.value, 'utf8', function (err) {
      if (err) return reject(err);
      return resolve(result.messages);
    });
  })
}

const promiseList = files.map(i => new Promise((resolve, reject) => {
  return resolve(mammoth.convertToHtml({path: `doc/${i}`}));
}).then(result => {
  return writeFileFun(i, result)
}));

// const promiseList = files.map((i, index) => new Promise((resolve, reject) => {
//   mammoth.convertToHtml({path: `doc/${i}`})
//   // .then(function (result) {
//   // const html = result.value; // The generated HTML
//   // const messages = result.messages; // Any messages, such as warnings during conversion
//   // console.log(messages);
//   // resolve(result);
//   // })
//       .then(result => {
//         fs.writeFile('convertTemplate/' + i + '.html', result.value, 'utf8', function (err) {
//           if (err) return reject(err);
//           resolve(result.messages);
//         });
//       })
//       .done();
// }));
Promise.all(promiseList).then((result) => {
  console.log(result)
  // console.log('=======');
  // result.forEach((item, index) => {
  //   console.log(index);
  //   fs.writeFile('convertTemplate/'+index + '.html', item, 'utf8', function (err) {
  //     if (err) return console.log(err);
  //   });
  // })
}).catch((error) => {
  console.log('error: ' + error)
})
// mammoth.convertToHtml({path: "doc/5变更协议.docx"})
//     .then(function (result) {
//       var html = result.value; // The generated HTML
//       var messages = result.messages; // Any messages, such as warnings during conversion
//       console.log(html);
//       console.log('=======');
//       console.log(messages);
//     })
//     .done();