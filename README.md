# vue.company

## 项目简介
vue.company 是一个后台管理系统，它基于 vue 和 element-ui实现。它使用了最新的前端技术栈，主要实现有动态路由，权限验证，m3u8加密视频播放，支付宝微信支付等，提炼了典型的业务模型，它可以帮助你快速搭建企业级中后台产品原型，希望本项目能够帮助到你。

<a href="https://peixun.2haohr.com/i">项目预览地址</a>（由于公司内网做了限制预览请使用PC端, PC端预览--用户名：hrloo 密码：eiV8nee8）

## 前序准备
你需要在本地安装 <a href="https://nodejs.org/en/">node</a> 和  <a href="https://git-scm.com/">git</a> 。本项目技术栈基于 
<a href="https://nodejs.org/en/">ES2015+</a>、 
<a href="https://cn.vuejs.org/">vue</a>、
<a href="https://vuex.vuejs.org/zh/guide/">vuex</a>、
<a href="https://router.vuejs.org/zh/">vue-router</a>、
<a href="https://cli.vuejs.org/zh/guide/cli-service.html">vue-cli </a>、
<a href="https://www.kancloud.cn/yunye/axios/234845">axios </a>、
<a href="https://element.eleme.cn/#/zh-CN">element-ui </a>，提前了解和学习这些知识会对使用本项目有很大的帮助。所有的数据都是从公司<a href="http://www.hrloo.com/">三茅网</a>服务器实时获取的真实数据，具有真实的登陆、管理数据、权限验证等功能。



#### 如有问题 欢迎 issue 和 email
![img](https://github.com/751221644/qydx/blob/master/static/1.gif)

## 开发

```
# 克隆项目
git clone https://github.com/lithromantic-Fish/qydx.git

# 进入项目目录
cd vue.company

# 安装依赖
npm install

# 建议不要用 cnpm 安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```
## 发布

```
# 构建生产环境
npm run build
```
## License
MIT

Copyright (c) 2019-present Fish
