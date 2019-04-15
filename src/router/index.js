import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/Home/home'
import login from '@/views/login'
//路由懒加载
const lessonCenter = () => import('@/views/lessonCenter/lessonCenter')
const buyLesson = () => import('@/views/lessonCenter/buyLesson')
const studyRecord = () => import('@/views/studyCenter/studyRecord')
const studyCenter = () => import('@/views/studyCenter/studyCenter')
const studyDetail = () => import('@/views/studyCenter/studyDetail')
const studyVideo = () => import('@/views/studyCenter/studyVideo')
const person = () => import('@/views/personalCenter/person')
const companyManage = () => import('@/views/companyManage/companyManage')
const companyInfo = () => import('@/views/companyManage/companyInfo')
const lessonManage = () => import('@/views/companyManage/lessonManage')
const staffManage = () => import('@/views/companyManage/staffManage')
const companyDetails = () => import('@/views/companyManage/companyDetails')
const staffStudyRecord = () => import('@/views/companyManage/staffStudyRecord')
const staffRecord = () => import('@/views/companyManage/staffRecord')
const lessonInfo = () => import('@/views/lessonCenter/lessonInfo')
const nofound = () => import('@/page404')

Vue.use(Router)
let defaultRouter = [
  {
    path: '/',
    hasChild: true,
    hidden: true,
    redirect: '/login',
  },
  {
    path: '/login',
    name: '登陆',
    component: login,
    hasChild: true,
    hidden: true,
    children: [],
  },
  {
    path: '/',
    name: '全部课程',
    component: home,
    icon: 'icon-lesson',
    hasChild: false,//只有一个节点
    meta: { role: ['admin'], auth: true },
    children: [{
      path: '/lessonCenter',
      name: '课程中心',
      component: lessonCenter
    }, {
      path: '/lessonInfo',
      name: '课程简介',
      component: lessonInfo,
      hidden: true,
    },
    {
      path: '/buyLesson',
      name: '购买课程',
      component: buyLesson,
      hidden: true,
    }]
  },
  {
    path: '/page404',
    component: nofound,
    name: 'page404',
    hidden: true,
    hasChild: true,
    children: []
  },
]
let addRouter = [

  {
    path: '/',
    name: '学习中心',
    component: home,
    icon: 'icon-study',
    hasChild: true,//
    meta: { role: ['admin', 'staff'], auth: true },
    children: [
      {
        path: '/studyCenter',
        name: '课程学习',
        component: studyCenter,
        hasChild: false,//只有一个节点
      },
      {
        path: '/studyRecord',
        name: '学习记录',
        component: studyRecord,
        hasChild: false,//只有一个节点
      },
      {
        path: '/studyDetail',
        name: '学习详情',
        component: studyDetail,
        hidden: true,
        hasChild: false,//只有一个节点
      },
      {
        path: '/studyVideo',
        name: '课程播放',
        component: studyVideo,
        hidden: true,
        hasChild: false,//只有一个节点

      }
    ]
  },
  {
    path: '/',
    name: '企业管理',
    component: home,
    icon: "icon-mmanage",
    hasChild: true,//
    meta: { role: ['admin'], auth: true },
    children: [
      {
        path: '/companyManage',
        name: '企业概况',
        component: companyManage,
      },
      {
        path: '/lessonManage',
        name: '课程管理',
        component: lessonManage,
      },
      {
        path: '/companyDetails',
        name: '分配明细',
        component: companyDetails,
        hidden: true

      }, {
        path: '/staffStudyRecord',
        name: '员工学习记录',
        component: staffStudyRecord,
      }, {
        path: '/staffManage',
        name: '员工管理',
        component: staffManage,
      }, {
        path: '/companyInfo',
        name: '企业信息',
        component: companyInfo,
      }, {
        path: '/staffRecord',
        name: '订单记录',
        component: staffRecord,
      }],
  },
  {
    path: '/',
    name: '',
    component: home,
    meta: { role: ['admin', 'staff'], auth: true },
    icon: 'icon-person',
    hasChild: false,//只有一个节点
    children: [{
      path: '/person',
      name: '个人中心',
      component: person
    }]
  },

]
export default new Router({
  // mode: 'history',
  routes: defaultRouter
})

export { defaultRouter, addRouter }