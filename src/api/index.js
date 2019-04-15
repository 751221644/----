// * api接口的统一出口
//公共接口函数 
import global from './global';

// 文章模块接口
import article from './article';
// 登录接口

import toLogin from './login'

//课程接口中心
import lessonCenter from './lesson'

//企业信息中心
import companyInfo from './company'

//上传图片接口
import Upload from './article'

//个人中心
import person from './person'

// 企业大学接口
import school from './school'

// 导出接口
export default {
  global,
  article,
  toLogin,
  lessonCenter,
  companyInfo,
  person,
  school,
  Upload,
}