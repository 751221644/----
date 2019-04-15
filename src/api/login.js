/**
  * 登陆模块接口列表
  */

 import http from '../request/http'
 // 导入http中创建的axios实例
 import qs from 'qs'; // 根据需求是否导入qs模块
 const toLogin = {
     // post提交
     login (params) {
         return http.post('/hr/elp/school/passport_login', qs.stringify(params));
        },
        // 登录默认信息
        getDefaultInfo(params){
            return http.post('/hr/elp/school/school_logo', qs.stringify(params));
        },
        //获取登录角色
        getUserRole(params){
            return http.post('/hr/elp/school/user_role', qs.stringify(params));

    }
 }
 
 export default toLogin;