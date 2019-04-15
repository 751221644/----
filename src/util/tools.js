import { Loading } from 'element-ui';

var tools = {
    startLoding: () => {
        Loading.service({
            lock: true,
            text: '加载中……',
            background: 'rgba(0, 0, 0, 0.2)'
        })
    },
    closeLoading: () => {
        Loading.service().close();
    }
}

// 暴露给外部访问
export default tools;