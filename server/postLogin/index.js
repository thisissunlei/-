/**
 * @desc: 合同模板页面自动提交，合同申请，以及合同下载
 * @author: 刘毅豪(liuyihao@krspace.cn)
 */


const axios = require('axios')
const request = require('request');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const getData = require('./getData');


//对应的测试或者开发环境
const environment = 'optest04.krspace.cn';
/**
 * op登录接口
 * @param loginValicode 验证码
 * @param loginName 用户名称
 * @param loginPwd 用户密码
 */
const loginurl = `http://${environment}/api/krspace-sso-web/sso/login/validateCodeLogin`
/**
 * 合同模板提交按钮
 * @param name 模板名称
 * @param formId 对应的表id
 * @param content 合同模板的内容
 * @param id 合同模板id
 */
const setTemplateUrl = `http://${environment}/api/krspace-erp-web/sys/print-template`
/**
 * 申请合同接口
 * @param id 订单id
 * @param languageType 语言类型
 */
const applyContractUrl = `http://${environment}/api/krspace-op-web/order-seat/contractApply`
/**
 * 下载合同接口
 * @param requestId 合同id
 * @param contractType 是否带章
 */
const downPdfUrl = `http://${environment}/api/krspace-erp-web/wf/station/contract/pdf/down`;


let cookie = '';
let paramsDetail = getData();
const htmlTemlateUrl = path.resolve(__dirname, '../../client/template/page/' + paramsDetail.fileName);

axios.defaults.withCredentials = true
//系统登录
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
    let fileUrl = res.data.data;
    let filename = 'heTong.pdf';
    downloadFile(fileUrl, filename, function () {
      console.log(filename + '下载完毕');
    });
    // console.log("下载合同",)
  })
}

function downloadFile(uri, filename, callback) {
  // console.log(uri,"ppppp")
  // return ;
  let stream = fs.createWriteStream(filename);
  request(uri).pipe(stream).on('close', callback);
}



module.exports = function () {
  const loginName = 'chenzhenjiang@krspace.cn'
  const loginPwd = '123qwe'
  const loginValicode = 133;
  login(loginValicode, loginName, loginPwd)
}