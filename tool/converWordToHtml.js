var mammoth = require("mammoth");
var fs = require('fs');
var path=require('path');

var filePath = path.resolve('../doc');
var files = fs.readdirSync('./doc');

// console.log('file文件: ', files);
// var promiseList = files.map((i, index) => new Promise((resolve, reject) => {
//   mammoth.convertToHtml({path: `doc/${i}`})
//       .then(function (result) {
//         var html = result.value; // The generated HTML
//         var messages = result.messages; // Any messages, such as warnings during conversion
//         console.log(messages);
//         resolve(`${html}`);
//       })
//       .done();
// }))
// Promise.all(promiseList).then((result) => {
//   console.log(result)
//   console.log('=======');
// }).catch((error) => {
//   console.log(error)
// })
mammoth.convertToHtml({path: "doc/5变更协议.docx"})
    .then(function (result) {
      var html = result.value; // The generated HTML
      var messages = result.messages; // Any messages, such as warnings during conversion
      console.log(html);
      console.log('=======');
      console.log(messages);
    })
    .done();