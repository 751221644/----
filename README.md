# vue.company

这个权限管理就是为了方便,跟系统安全真的不沾边，只是根据后台返回的角色信息来生成他可以看见的菜单和按钮，显示菜单的方法是根据权限删除掉路由表里没有权限的路由，然后再动态添加，原本包含没有访问权限的原路由表只要打开页面运行代码就已经不存在了，并且404页面除了过滤掉项目没有的路由外，同时每次的路由跳转都会鉴权。如果你知道了没有权限的路由试着强行跳转会因为没有权限直接会跳转404。 就算通过查看代码或者其他方法获取全部路由，并且绕过404，花了这么大精力，，那你也看不到新世界的大门，因为所有数据都是通过后台请求返回来的，你没权限后台不会给你数据的，也不会让你去操作，，除非后台不验证权限，只要有人请求我就给你所有数据，，，，

项目预览地址：https://peixun.2haohr.com/i

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
