const type = process.env.NODE_ENV;

module.exports = function () {
  let paramsDetail = {
    templateId: 26,
    formId: 3,
    orderId: 13100,
    languageType: 'CHINESE',
    requestId: 13106,
    contractType: 'NOSEAL',
    fileName: 'member.html',
    name: '十月入住新模板'
  }
  if (type == 'add') {
    paramsDetail = {
      templateId: 27,
      formId: 3,
      orderId: 19140,
      languageType: 'CHINESE',
      requestId: 13106,
      contractType: 'NOSEAL',
      fileName: 'add.html',
      name: '2018-10增租'

    }
  }
  if (type == "renew") {
    paramsDetail = {
      templateId: 28,
      formId: 3,
      orderId: 19145,
      languageType: 'CHINESE',
      requestId: 13109,
      contractType: 'NOSEAL',
      fileName: 'renew.html',
      name: '2018-10续租'

    }
  }
  if (type == 'modify') {
    paramsDetail = {
      templateId: 29,
      formId: 3,
      orderId: 19146,
      languageType: 'CHINESE',
      requestId: 13111,
      contractType: 'NOSEAL',
      fileName: 'modify.html',
      name: '2018-10换租'

    }
  }
  return paramsDetail;
}