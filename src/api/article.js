/**
  * article模块接口列表
  */

 import base from './base'; // 导入接口域名列表
 import httpUpload from '../request/httpUpload'
 // 导入http中创建的axios实例
 import qs from 'qs'; // 根据需求是否导入qs模块
import { Upload } from 'element-ui';
 
 const article = {
     // 新闻列表
    //  articleList () {
    //      return http.get(`${base.sq}/topics`);
    //  },
    //  // 新闻详情,演示
    //  articleDetail (id, params) {
    //      return http.get(`${base.sq}/topic/${id}`, {
    //          params: params
    //      });
    //  },
     // post提交
    //  login (params) {
    //      return http.post(`${base.sq}accesstoken`, qs.stringify(params));
    //  },
    //  Upload(formdata){
    //     return httpUpload.post('/hr/elp/school/ajax_upload_image', formdata);

    //  },
   
     // 其他接口…………
 }
 
 export default article;