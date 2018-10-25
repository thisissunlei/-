const axios = require('axios')
const request = require('request');
const fs = require('fs');
const path = require('path');

const loginurl = `http://optest04.krspace.cn/api/krspace-sso-web/sso/login/validateCodeLogin`
const setTemplateUrl = `http://optest04.krspace.cn/api/krspace-erp-web/sys/print-template`
const applyContractUrl = `http://optest04.krspace.cn/api/krspace-op-web/order-seat/contractApply`
const downPdfUrl = `http://optest04.krspace.cn/api/krspace-erp-web/wf/station/contract/pdf/down`;
const querystring = require('querystring');
const type = process.env.NODE_ENV;
// console.log(process.env.NODE_ENV, "ppppp")
let cookie = '';
let paramsDetail = {
  templateId: 26,
  formId: 3,
  orderId: 13100,
  languageType: 'CHINESE',
  requestId: 13106,
  contractType: 'NOSEAL',
  fileName:'member.html',
  name:'十月入住新模板'
}
if (type == 'add') {
  paramsDetail = {
    templateId: 27,
    formId: 3,
    orderId: 19140,
    languageType: 'CHINESE',
    requestId: 13106,
    contractType: 'NOSEAL',
    fileName:'add.html',
    name:'2018-10增租'

  }
}
if(type=="renew"){
  paramsDetail = {
    templateId: 28,
    formId: 3,
    orderId: 19145,
    languageType: 'CHINESE',
    requestId: 13109,
    contractType: 'NOSEAL',
    fileName:'renew.html',
    name:'2018-10续租'

  }
}
if(type == 'modify'){
  paramsDetail = {
    templateId: 29,
    formId: 3,
    orderId: 19146,
    languageType: 'CHINESE',
    requestId: 13111,
    contractType: 'NOSEAL',
    fileName:'modify.html',
    name:'2018-10换租'

  }
}
console.log(paramsDetail,"ppp")
const htmlTemlateUrl = path.resolve(__dirname, '../template/page/'+paramsDetail.fileName);
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
    cookie = res.headers['set-cookie'][0];
    setTemplate()


  })

}

//模板提交
function setTemplate() {
  let content = fs.readFileSync(htmlTemlateUrl, 'utf8')
  let params = Object.assign({}, paramsDetail)
  const projectIDstr = querystring.stringify({ name: params.name, content: content, formId: params.formId, id: params.templateId })
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
  let params = Object.assign({}, paramsDetail)
  const projectIDstr = querystring.stringify({ id: params.orderId, languageType: params.languageType })
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
  let params = Object.assign({}, paramsDetail);
  const projectIDstr = querystring.stringify({ requestId: params.requestId, contractType: params.contractType })
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