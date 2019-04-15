# vue.company
主要实现：
1.后台管理系统权限控制侧边栏菜单(管理员，普通用户)
2.使用vue-video-player解码m3u8加密视频播放


这个项目最大的亮点就是使用localStorage控制权限菜单的功能，通过登录将后台返回的登录信息和角色信息存储，在路由守卫中获取角色信息以判断加载对应的角色路由，过程踩了不少坑，大家可以参考参考

项目预览地址：https://peixun.2haohr.com/i

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
