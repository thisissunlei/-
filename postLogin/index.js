const axios = require('axios')
const request = require('request');
const fs = require('fs');
const path = require('path');
const htmlTemlateUrl = path.resolve(__dirname, '../template/page/add.html');
const loginurl = `http://optest04.krspace.cn/api/krspace-sso-web/sso/login/validateCodeLogin`
const setTemplateUrl = `http://optest04.krspace.cn/api/krspace-erp-web/sys/print-template`
const applyContractUrl = `http://optest04.krspace.cn/api/krspace-op-web/order-seat/contractApply`
const downPdfUrl = `http://optest04.krspace.cn/api/krspace-erp-web/wf/station/contract/pdf/down`;
const querystring = require('querystring');
let cookie = '';
// const generateData = require('./generate.tem.data');
// import generateData from './generate.tem.data'
// const jsonPath = ;
axios.defaults.withCredentials = true
function login(loginValicode, loginName, loginPwd) {
  const loginaccess = querystring.stringify({ 'loginValicode': loginValicode, 'loginName': loginName, 'loginPwd': loginPwd })
  const options = {

    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
    data: loginaccess,
    url: loginurl,
  };
  axios(options).then(res => {

    // writeFile(path.resolve(__dirname + '/data/data.json'), JSON.stringify(eval('(' + res + ')'), null, 2))
    cookie = res.headers['set-cookie'][0];
    setTemplate()


  })

}


function setTemplate() {
  console.log(htmlTemlateUrl, "pppp")
  let content = fs.readFileSync(htmlTemlateUrl, 'utf8')
  // return ;
  // console.log(content,"kkkkkk")
  const projectIDstr = querystring.stringify({ name: '十月入住新模板', content: content, formId: 3, id: 26 })
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    },
    data: projectIDstr,
    url: setTemplateUrl,
    responseType: 'json'
  };
  axios(options).then(res => {
    if (res.data.code < 0) {

      console.error('模板更新出错');
      return;
    }
    applyContract();
    console.log("模板更新")
  })
}
// http://optest04.krspace.cn/api/krspace-op-web/order-seat/contractApply
//申请合同
function applyContract() {
  const projectIDstr = querystring.stringify({ id: 19131, languageType: 'CHINESE' })
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    },
    data: projectIDstr,
    url: applyContractUrl,
    responseType: 'json'
  };
  axios(options).then(res => {
    if (res.data.code < 0) {

      console.error('申请合同出错', res.data);
      return;
    }
    console.log("申请合同")
    downPdf();
  })
}
function downPdf() {
  const projectIDstr = querystring.stringify({ requestId: 13100, contractType: 'NOSEAL' })
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    },
    data: projectIDstr,
    url: downPdfUrl,
    responseType: 'json'
  };
  axios(options).then((res) => {
    if (res.data.code < 0) {
      // console.log("=======",res.data.message)
      if (res.data.message == '合同尚未生成完成，请稍候重试') {
        // console.log("=======")
        setTimeout(() => {
          downPdf()
        }, 500)


        return;
      }
      console.error('下载合同出错');
      return;
    }
    var fileUrl = res.data.data;
    var filename = 'heTong.pdf';
    downloadFile(fileUrl, filename, function () {
      console.log(filename + '下载完毕');
    });
    // console.log("下载合同",)
  })
}

function downloadFile(uri, filename, callback) {
  // console.log(uri,"ppppp")
  // return ;
  var stream = fs.createWriteStream(filename);
  request(uri).pipe(stream).on('close', callback);
}



module.exports = function () {
  const loginName = 'chenzhenjiang@krspace.cn'
  const loginPwd = '123qwe'
  const loginValicode = 133;
  login(loginValicode, loginName, loginPwd)
}