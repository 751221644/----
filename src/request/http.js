import axios from 'axios';
import store from '../store/index';
import { Message, Loading } from 'element-ui';
import Cookies from 'js-cookie'
/**
  * 跳转登录页
  * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
  */
// const toLogin = () => {
//     router.replace({
//         path: '/login',
//         query: {
//             redirect: router.currentRoute.fullPath
//         }
//     });
// }

// * 请求失败后的错误统一处理
// * @param {Number} status 请求失败的状态码
// */
function startLoding() {
    Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function closeLoading() {
    Loading.service().close();
}
const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {

        // 401: 未登录状态，跳转登录页
        case 401:
            toLogin();
            break;
        // 403 token过期
        // 清除token并跳转登录页
        case 403:
            Message.error({ message: '权限不足,请联系管理员!' });
            // localStorage.removeItem('token');
            store.commit('loginSuccess', null);
            setTimeout(() => {
                toLogin();
            }, 1000);
            break; 
        // 404请求不存在
        case 404:
            Message.error({ message: '服务器被吃了⊙﹏⊙∥' });
            break;
        default:
    }
}

// 创建axios实例
var http = axios.create({ baseURL: '/api', timeout: 1000 * 12 });

// 设置post请求头
http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// http.defaults.headers.post['Content-Type'] = 'multipart/form-data';
/**
* 请求拦截器
* 每次请求前，如果存在token则在请求头中携带token
*/
http.interceptors.request.use(
    config => {
        // startLoding();
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
        const token = store.state.token
        token && (config.headers.Authorization = token);
        config.headers.elptoken = token
        // config.headers.Cookie = 'token='+token
        return config;
    },
    error => Promise.error(error))

// 响应拦截器
http.interceptors.response.use(
    // 请求成功
    // res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
    res => {
        // closeLoading();
        console.log('res.data.result',res.data.result);
        
        if (res.status == 200) {
            //请求100登录失效
            if(res.data.result==100||res.data.result==98){
                window.location.href = 'https://peixun.2haohr.com/i'
                 Message.error(res.data.msg)
            }
            // Message.success('请求成功')
            return res;
        }
       
    },
    // 请求失败
    error => {
        // closeLoading();
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            // store.commit('changeNetwork', false);
        }
    });

export default http;