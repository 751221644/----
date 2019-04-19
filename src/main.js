// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './theme/color.less'
import './theme/index.less'
import './theme/flex.less'
import echarts from 'echarts'
import api from './api'
import global from './api/global'
import 'babel-polyfill';
import base from './api/base'
import storage from './util/storage'
import tools from './util/tools'
import elementUIVerify from 'element-ui-verify'
import config from './util/config'
import VueWechatTitle from 'vue-wechat-title'
import VueVideoPlayer from 'vue-video-player'
import 'videojs-contrib-hls.js/src/videojs.hlsjs'
import VueClipboard from 'vue-clipboard2'
import _ from 'lodash'
Vue.use(VueClipboard)
Vue.use(VueVideoPlayer)
Vue.use(VueWechatTitle)
Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.prototype._ = _
Vue.prototype.$echarts = echarts              //echart
Vue.prototype.$api = api                     //api调用封装出口
Vue.prototype.$global = global               //全局通用函数
Vue.prototype.$imagePath = base.cssPath     //图片公用路径前缀
Vue.prototype.$storage = storage             //storage的封装方法
Vue.prototype.$tools = tools             //封装的公共方法
Vue.prototype.$config = config              //全局配置变量
Vue.use(ElementUI)
Vue.use(elementUIVerify)

router.beforeEach((to, from, next) => {
  if (store.state.token) {
    store.dispatch('setToken', store.getters.token)
    if (to.path === '/login') {
      next({ path: '/lessonCenter' })
    } else {
      if (!store.getters.info) {
        !async function getAddRouters() {
          await store.dispatch('getInfo', store.getters.info)
          await store.dispatch('newRoutes', store.getters.info.role)
          await router.addRoutes(store.state.addRouters)
          // next({ path: '/lessonCenter' })
          var _role = storage.get('role')
          var isChange = storage.get('isChange')
          //权限为普通用户时
          if (_role == 'staff') {
            next({ path: '/studyCenter' })
          } else {
            if (isChange) {
              next({
                path: '/companyManage'
              })
              storage.remove('isChange')
            } else {
              next({
                path: to.fullPath
              })
            }
          }
        }()
      } else {
        next()
      }

    }
  } else {
    if (to.path == '/login') {
      next()
    }
    //判断是否为login页url拼接
    if (to.fullPath.indexOf('/login?') != -1) {

    }
    else {
      next({ path: '/login' })
    }
  }
});



new Vue({
  el: '#app',
  router,
  store,
  VueRouter,
  components: { App },
  template: '<App/>'
})
