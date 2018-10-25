## 合同模板开发项目

### 目录介绍

**client**

>合同模板开发页面

**dist**

>最终生成的包含js的合同模板的存放地址

**docToHtml**

>world 文档转换成 html ，并可以对文本做一定的处理，world 存放在 doc 文件夹，并写好版本号；生成的 html 的文件放在 convertTemplate 文件夹，并放在对应版本的文件下。

**server**

>启动一个 node 服务，并监听dist文件的修改
1. postLogin 文件加是将生成的模板提交到后台并且，申请合同以及下载 pdf 
2. converWordToHtml 是将 docToHtml 文件加下的 doc 中的对应版本的 word 文件 转换成 html 文件
3. renderMainTabel 生成对应的 组件文件
4. setTemplate 是将 client/template 下面的 component 文件夹和 template 文件夹下的内容合成放模板文件放在 client/template/page 里

