/**
  * 企业模块接口列表
  */

import http from '../request/http'
// 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const companyInfo = {
    // post提交
    /*
    * 获取当前选择的大学信息 
    * 说明: null
    * 参数: null
    */
    company(params) {
        return http.post('/hr/elp/school/school_info', qs.stringify(params));
    },
    /*
    * 创建大学
    * 说明: null
    * 参数:
    *  school_name: 企业大学名称
    */
    createCompany(params) {
        return http.post('/hr/elp/school/create_school', qs.stringify(params));
    },
    /*
    * 修改企业信息 
    * 说明: null
    * 参数:
    *  school_name: 企业大学名称
    *  enter_name: 企业名称
    *  people: 公司规模
    *  telephone: 联系方式
    */
    updateCompanyInfo(params) {
        return http.post('/hr/elp/school/update_school', qs.stringify(params));
    },
    /*
    * 根据部门id 获取部门下所有员工 
    * 说明: null
    * 参数:
    *  dep_id: 部门id
    * 
    */
    getDepStaffList(params) {
        return http.post('/hr/elp/school/get_dep_staff', qs.stringify(params));
    },
    /*
    * 更换管理员提交 
    * 说明: null
    * 参数:
    *  new_uid: 新管理员uid
    *  verifycode: 短信验证码
    */
    changeAdmin(params) {
        return http.post('/hr/elp/school/change_admin', qs.stringify(params));
    },
    /*
    * 根据姓名模糊搜索员工
    * 说明: null
    * 参数:
    *  name: 姓名
    */
    getStaffListByName(params) {
        return http.post('/hr/elp/school/staff_list_page', qs.stringify(params));
    },
    /*
    * 根据部门名称模糊搜索部门
    * 说明: 不传参数就是获取所有的部门
    * 参数:
    *  dep_name: 部门名称
    */
    getDepByName(params) {
        return http.post('/hr/elp/school/ajax_dep', qs.stringify(params));
    },
    //审核表格
    staff_list_log(params){
        
        return http.post('/hr/elp/school/staff_list_log', qs.stringify(params));
    },
    //添加员工
    addStaff(){
        return http.post('/hr/elp/school/term_url');
    },
    //移除员工
    deleteStaff(params){
        return http.post('/hr/elp/school/staff_del', qs.stringify(params));
    },
    //编辑员工
    staff_update(params){
        return http.post('/hr/elp/school/staff_update', qs.stringify(params));
    },
    //子账号购买
    pay_staff(params){
        return http.post('/hr/elp/school/pay_staff', qs.stringify(params));
    },
    //转移员工
    staff_change(params){
        return http.post('/hr/elp/school/staff_change', qs.stringify(params));
    },
    //新增员工
    dep_add(params){
        return http.post('/hr/elp/school/dep_add', qs.stringify(params));
    },
    // 编辑部门
    dep_opt(params){
        return http.post('/hr/elp/school/dep_opt', qs.stringify(params));
    },
    //员工审核
    staff_access(params){
        return http.post('/hr/elp/school/staff_access', qs.stringify(params));
    }
}

export default companyInfo;