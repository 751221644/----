/**
  * 企业模块接口列表
  */

import http from '../request/http'
import httpUpload from '../request/httpUpload'
// 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const global = {
  // post提交
  /*
  * 发送短信验证码 
  * 说明: 发送短信验证码必须配合腾讯防水墙
  * 参数:
  * mobile: 手机号码
  * ticket: r.ticket // 腾讯返回->验证成功的票据，当且仅当ret=0时ticket有值
  * randstr: r.randstr
  */
  getMsg(params) {
    return http.post('/hrloo.php?m=api&c=index&a=ajax_send_verify_msg_tx', qs.stringify(params));
  },
  /*
  * 修改手机号码
  * 参数
  * mobile: 旧手机号码
  * verifycode: 旧手机短信验证码
  * mobile_new:  新手机号码
  * verifycode_new: 新手机短信验证码
  */
  modifyMobile(params) {
    return http.post('/hrloo.php?m=passport&c=index&a=ajax_school_bind_mobile', qs.stringify(params));
  },
  /*
  * 上传图片
  * 参数: formData
  * 说明:
  * imgFile为后台规定值
  * formData必须要把 file -> append 为 "imgFile"
  * 使用示例:
  * let formData = new FormData();
  * formData.append("imgFile", file);
  */
  uploadImage(formdata) {
    return httpUpload.post('/hr/elp/school/ajax_upload_image', formdata);
  },
  /*
  * 修改企业头像
  * 参数:
  * logo: 图片地址
  */
  modifyCompanyLogo(params) {
    return http.post('/hr/elp/school/update_school_logo', qs.stringify(params));
  },
  /*
  * 获取当前用户所有订单信息
  * 参数:
  * page: 不传默认第一页,每页20条
  */
  getOrderList(params) {
    return http.post('/hr/elp/school/paylist', qs.stringify(params));
  },
  /*
  * 获取订单支付状态
  * 参数:
  *   elp_token: token
  *   orderid: 订单号
  */
  getOrderPayState(params) {
    return http.post('/hr/elp/school/check_ispayok', qs.stringify(params));
  }
}

export default global;