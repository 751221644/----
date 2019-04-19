import {defaultRouter, addRouter} from '../router/index'
const actions = {

    setToken ({commit}, token) {
        return new Promise((resolve, reject) => {
          commit('setToken', token)
          resolve()
        })
      },
      newRoutes ({commit}, role) {
        
        //  通过递归路由表，删除掉没有权限的路由
        function eachSelect (routers, userRole) {
          for (let j = 0; j < routers.length; j++) {
            if (routers[j].meta && routers[j].meta.role.length && routers[j].meta.role.indexOf(userRole) === -1) {
              routers.splice(j, 1)
              j = j !== 0 ? j - 1 : j
            }
            if (routers[j].children && routers[j].children.length) {
              eachSelect(routers[j].children, userRole)
            }
          }
        }
        // 拷贝这个数组是因为做权限测试的时候可以从低级切回到高级角色，仅限演示，正式开发时省略这步直接使用 addRouter
        // 仅限演示
        let newArr = [...addRouter]
        
        eachSelect(newArr, role)
        commit('setRouters', newArr)
      },
      getRole({commit},token){
        commit("getRole",token)
      },
      changePrice({commit},price){
        commit("changePrice",price)
      },
      getInfo ({commit}, token) {
        commit('getInfo', token)
      },
      setRole ({commit}, options){
        // 权限测试
        commit('setRole', options)
      },
      getPersonInfo({commit},info){
        
        commit('getPersonInfo',info)
      },
      changeLogin({commit},state){
        commit('changeLogin',state)
      },
      schoolNum({commit},length){
          commit('schoolNum',length)
      },
      schoolId({commit},info){
          commit('schoolId',info)
      }
    }
export default actions
