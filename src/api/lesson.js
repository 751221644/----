/**
  * 课程中心模块接口列表
  */

import http from '../request/http'
// 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const lessonCenter = {
    //课程中心首页
    lesson(params) {
        return http.post('/hr/elp/course/course_center',  qs.stringify(params));

    },
    // //判断是否已购买该课程
    // judgeLessonBuy(params) {
    //     console.log('parm,s', params);

    //     return http.post('/hr/elp/course/is_buy_package', qs.stringify(params));
    // },
    //获取当前课程包信息
    getCurrentLesson(params) {
        console.log('parms', params);

        return http.post('/hr/elp/course/package_product', qs.stringify(params));

    },
    //购买课程包
    buylesson(params) {
        return http.post('/hr/elp/school/pay_video', qs.stringify(params));
    },
    /*
    * 根据类型获取课程列表
    * 说明: null
    * 参数:
    *  status: 1有效课程， 2已过期 ，3已下架，不传值则为全部
    *  name: 课程包的名称S
    */
    getLessonListByStatus(params) {
        return http.post('/hr/elp/course/course_manage', qs.stringify(params));
    },


    /*
    * 根据部门id和课程包id 获取部门下所有员工
    * 说明: 因为某些员工不能选择 有disabled属性
    * 参数:
    *  dep_id: 部门ID
    *  package_id 课程包ID
    */
    getAssignStaff(params) {
        return http.post('/hr/elp/course/get_assign_staff', qs.stringify(params));
    },
    /*
    * 检测分配课程权限
    * 说明: 传课程包ID获取是否有分配课程的权限
    * 参数:
    *  package_id: 课程包ID
    * 返回结果 result:
    *  1：若需分配更多的成员，请增加账号
    *  2：若需分配给更多成员，请联系客服
    *  3: 课程包已过期，请重新购买
    */
    assignCheck(params) {
        return http.post('/hr/elp/course/assign_check', qs.stringify(params));
    },
    /*
    * 提交分配课程权限 
    * 说明: null
    * 参数: {package_id,uids,message}
    *  package_id: 课程包ID
    *  uids:       需要增加的员工uid数组
    *  message:    编辑的留言
    * 返回结果 result:
    *  1：若需分配更多的成员，请增加账号
    *  2：若需分配给更多成员，请联系客服
    *  3: 课程包已过期，请重新购买
    */
    assignPackage(params) {
        return http.post('/hr/elp/course/assign_package', qs.stringify(params));
    },
    /*
    * 提交编辑留言
    * 说明: 
    *  传课程包ID和message编辑留言
    * 参数 params:
    *  package_id: 课程包ID
    *  message: 留言
    */
    editMessage(params) {
        return http.post('/hr/elp/course/edit_message', qs.stringify(params));
    },
    /*
    * 课程包下的分配明细表
    * 说明 : 
    *  获取或者搜索
    *  传课程包ID和message编辑留言
    * 参数 params:
    *  package_id: 课程包ID
    *  starttime:  搜索的开始时间
    *  endtime:    搜索的结束时间
    *  username:   搜索的姓名
    *  dep_id:     搜索的部门id
    */
    getAssignList(params) {
        return http.post('/hr/elp/course/assign_list', qs.stringify(params));
    },
    /*
    * 删除明细表中的某个用户
    * 说明 : 
    * 参数 params:
    *  id: 是数据id,不是uid
    */
    delAssign(params) {
        return http.post('/hr/elp/course/del_assign', qs.stringify(params));
    },
    //申请试看
    getApplyView(params) {
        return http.post('/hr/elp/course/add_apply', qs.stringify(params));
    },
    //播放视频
    playVideo(params) {
        return http.post('/hr/elp/course/video_play', qs.stringify(params));

    },
    //视频列表
    videoList(params) {
        return http.post('/hr/elp/course/course_list', qs.stringify(params));
        
    },
    //领取课程
    receiveVideo(params){
        return http.post('/hr/elp/course/receive_package', qs.stringify(params));
    }

}


export default lessonCenter;
