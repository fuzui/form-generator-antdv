<h1 align="center">Form Generator Antdv</h1>

> Ant Design Vue表单设计及代码生成器

<p align="center">
 <a href="https://gitee.com/fuzui/form-generator-antdv" target="_blank"><img src="https://gitee.com/fuzui/form-generator-antdv/badge/star.svg?theme=dark" alt="Build Status"></a>&nbsp;
 <a href="https://github.com/fuzui/form-generator-antdv" target="_blank"><img src="https://img.shields.io/github/stars/fuzui/form-generator-antdv.svg?style=social" alt="Build Status"></a>&nbsp;
 <a href="https://github.com/vueComponent/ant-design-vue" target="_blank"><img src="https://img.shields.io/badge/Ant Design Vue-1.7.8-brightgreen" alt="Build Status"></a>
</p>


------------------------------

## 简介

**Form Generator Antdv**，由[form-generator](https://github.com/JakHuang/form-generator)搬运而来。form-generator是一个优秀的Element UI表单设计及代码生成器，此项目将其改为Ant Design Vue。

> 目前支持所有表单类组件(Data Entry)，支持布局类组件：Grid 栅格，通用类组件：Button 按钮。
>
> 可将生成的代码直接运行在基于Ant Design Vue的vue项目中；也可导出JSON表单，使用配套的解析器将JSON解析成真实的表单。

* 预览：[https://fga.setworld.net/](https://fga.setworld.net/)

* form-generator：[https://github.com/JakHuang/form-generator](https://github.com/JakHuang/form-generator)

* Ant Design Vue文档：[https://1x.antdv.com/docs/vue/introduce-cn/](https://1x.antdv.com/docs/vue/introduce-cn/)

## JSON解析器

将保存在数据库中的JSON表单，解析成真实的表单  
在线示例: [https://fga.setworld.net/#/parser](https://fga.setworld.net/#/parser) 

```
// 安装
npm i form-gen-antdv-parser
```

[更多信息](https://github.com/fuzui/form-generator-antdv/tree/master/src/components/parser) 

## 开始使用
1. 环境准备
   * 安装[node](http://nodejs.org/)和[git](https://git-scm.com/)

2. 安装

   ```shell
   git clone git@gitee.com:fuzui/form-generator-antdv.git
   ```

   或

   ```shell
   git clone git@github.com:fuzui/form-generator-antdv.git
   ```

3. 本地开发

   进入项目根目录

   ```shell
   npm install
   ```

   > 若耗时太长可使用`npm install --registry=https://registry.npm.taobao.org`

   ```shell
   npm run serve
   ```

   > 打开浏览器访问 [http://localhost:8080](http://localhost:8080/)

4. 构建

   ```shell
   npm run build
   ```

## 文档
如需开发或想要了解，可以去查阅[form-generator](https://github.com/JakHuang/form-generator)文档，其作者[JakHuang](https://github.com/JakHuang)描述的很全，向其表示由衷感谢。

## 致谢

* [form-generator](https://github.com/JakHuang/form-generator) Element UI表单设计及代码生成器
* [Ant Design Vue](https://github.com/vueComponent/ant-design-vue/) An enterprise-class UI components based on Ant Design and Vue
* [Ant Design Vue Pro](https://github.com/vueComponent/ant-design-vue-pro) Use Ant Design Vue like a Pro
  
  > 参考了其图标选择器与国际化实现

## 联系

如果您发现了什么bug，或者有什么界面建议或意见，

欢迎 [issue](https://github.com/fuzui/form-generator-antdv/issues)

## 界面展示
![](https://oss.fuzui.net/img/202202120318359.png)
