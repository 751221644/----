// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import _ from 'lodash'
import Vue from 'vue'
import api from './api'
import App from './App'
import store from './store'
import echarts from 'echarts'
import base from './api/base'
import router from './router'
import tools from './util/tools'
import global from './api/global'
import config from './util/config'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import storage from './util/storage'
import VueClipboard from 'vue-clipboard2'
import elementUIVerify from 'element-ui-verify'
import VueWechatTitle from 'vue-wechat-title'
import VueVideoPlayer from 'vue-video-player'
import './theme/color.less'
import './theme/index.less'
import './theme/flex.less'
import 'babel-polyfill';
import 'element-ui/lib/theme-chalk/index.css';
import 'videojs-contrib-hls.js/src/videojs.hlsjs'
Vue.use(VueClipboard)
Vue.use(VueVideoPlayer)
Vue.use(VueWechatTitle)
Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.prototype._ = _                            //lodash
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
          console.log('store.getters.info',store.getters);
          
          await store.dispatch('getInfo', store.getters.info)
          await store.dispatch('newRoutes', store.getters.info.role)
          await router.addRoutes(store.state.addRouters)
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
