/**
  * 大学模块接口列表
  */

 import http from '../request/http'
 // 导入http中创建的axios实例
 import qs from 'qs'; // 根据需求是否导入qs模块
 const school = {
     // 切换大学
     changeSchool (params) {
         return http.post('/hr/elp/school/change_school', qs.stringify(params));
     },
     //获取用户的所有大学
     getAllSchool(params){
        return http.post('/hr/elp/school/my_school', qs.stringify(params));
        
    },
    getSchoolInfo(){
        return http.get('/hr/elp/school/school_info');
        
    },
    //创建大学
    create_school(params){
        return http.post('/hr/elp/school/create_school', qs.stringify(params));
        
    },
    //订单
    pay_order(params){
        return http.post('/hr/elp/school/pay_ajax', qs.stringify(params));
     }
     // 其他接口…………
 }
 
 export default school;