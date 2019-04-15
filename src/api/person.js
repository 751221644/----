/**
 * 个人中心接口列表
 */

import http from '../request/http'
// 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块
const person = {
	// post提交
	getSchoolId(params) {
		return http.post('/hr/elp/school/my_school', qs.stringify(params));

	},
	// 学习中心接口
	getStudyCenter(params){
		return http.post('/hr/elp/course/study_center', qs.stringify(params));
	},
	//企业大学信息
	schoolInfo(params){
		return http.post('/hr/elp/school/school_info', qs.stringify(params));
	},
	//加入/创建大学信息
	mySchool(params){
		return http.post('/hr/elp/school/my_school', qs.stringify(params));
	},
	//提交修改用户名
	updateUsername(params){
		return http.post('/hr/elp/school/change_username', qs.stringify(params));
	},
	//学习中心数据
	studyLog(params){
		return http.post('/hr/elp/course/study_log', qs.stringify(params));
	},
	//员工学习记录
	staffStudyLog(params){
		return http.post('/hr/elp/course/staff_study_log', qs.stringify(params));
	},
	//部分查询
	departMent(params){
		return http.post('/hr/elp/school/ajax_dep', qs.stringify(params));
	},
	//课程详情
	studyDeatil(params){
		return http.post('/hr/elp/course/package_detail', qs.stringify(params));
	},
	//课程详情列表
	studyDeatilList(params){
		return http.post('/hr/elp/course/course_list', qs.stringify(params));
	}

	// 其他接口…………
}

export default person;