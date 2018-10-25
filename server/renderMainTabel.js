const path = require('path');
const fs = require('fs');
const componentsPath = path.resolve(__dirname, '../client/template/components');
//会员详情
const memberArr = [
  { label: '会员公司/贵方（法定登记的名称）', value: 'lessee_name' },
  { label: '管理员姓名', value: 'manager_name' },
  { label: '电话及电子邮箱', value: 'manager_phone_email' },
  { label: '通讯地址', value: '' },
  { label: '账单联系人', value: '' },
  { label: '电话及电子邮箱', value: '' },
  { label: '通讯地址', value: '' },
  { label: '签署日期', value: 'sign_date' },
]
//服务主体
const serviceArr = [
  {label:'公司名称',value:'corporation_name'},
  {label:'社区名称',value:'community_name'},
  {label:'开户名称',value:'account_name'},
  {label:'开户账号',value:'account_number'},
  {label:'开户银行',value:'bank_name'},
  {label:'社区经理',value:'#{img}'},
  {label:'电子邮箱',value:'contact_email'},
  {label:'通讯地址',value:'community_address'},
]
//服务费
const serviceCostArr=[
  {label:'服务期限',value:'{{start_date}}至{{end_date}}'},
  {label:'服务保证金',value:'￥{{performance_bond}}'},
  {label:'服务费总额(含税)',value:'￥{{prefer_service_fee}}'},
]
//付款信息
const paymentArr = [
  {label:'付款周期（除首期付款外）',value:'pay_type'},
  {label:'首付款金额',value:'￥{{first_service_fee}}'},
  {label:'首付款日期',value:'first_pay_date'},
]
//补充信息
const supplementArr=[
  {label:'居间方全称',value:''}
]
//生成主表方法
function memberDetailRender(arr, name) {
  let str = '';
  arr.map((item) => {
    let labelStr = '<span class="main-table-label">' + item.label + '：</span>';
    let valueStr = '<span class="main-table-value">{{' + item.value + '}}</span>';
    if (!item.value) {
      valueStr = '';
    }
    if (item.value.indexOf("#{")!=-1||item.value.indexOf("{{")!=-1) {
      valueStr = '<span class="main-table-value">' + item.value + '</span>';
    }
    str += '<div class="main-table-col">' + labelStr + valueStr + '</div>'
  })
  // return str;
  fs.writeFileSync(componentsPath + '/' + name, str, 'utf8');
}

module.exports = function () {
  memberDetailRender(memberArr, 'member-detail-tm')
  memberDetailRender(serviceArr, 'service-detail-tm')
  memberDetailRender(serviceCostArr, 'service-cost-detail-tm')
  memberDetailRender(paymentArr, 'payment-detail-tm')
  memberDetailRender(supplementArr, 'supplement-detail-tm')
}