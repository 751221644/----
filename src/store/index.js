import Vue from 'vue'
import Vuex from 'vuex'
// import mutations from './muations'
import actions from './action'
import getters from './getters'
import mutations from './muations'
import Cookies from 'js-cookie'
// import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)
const state = {
    isLogin:0, 
    info: '', // 每次刷新都要通过token请求个人信息来筛选动态路由
    routers: [],//所有有权限的路由表，用来生成菜单列表
    addRouters: [],// 保存动态路由用来addRouter
    token: Cookies.get('token'),
    personInfo:{
    },//用户信息
    currentSchoolId:'',
    orderTotalPrice:null
}


export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    // plugins: [createPersistedState()] //vuex持久化
})