import axios from 'axios';
import { getToken, removeToken, getItem} from './storage';
import { apiPath } from './constants';
import Vue from "vue"

// 配置后端接口路径
axios.defaults.baseURL = apiPath;
//设置请求时间
axios.defaults.timeout = 90000;

axios.interceptors.request.use(function (config) {
    const token = getToken();
    if (token) {
        config.headers.token = token;
    }
    return config;
}, function (err) {
    return Promise.reject(err);
});

axios.interceptors.response.use(function (res) {
    return res;
}, function (err) {
    // eslint-disable-next-line
    var appRouter = window.__VUE_APP__.$router;
    switch (err.response.status) {
        // 未授权或禁止访问
        case 401:
        case 403:
            removeToken();
            if (appRouter.currentRoute.name !== 'login') {
                if (appRouter.currentRoute.meta.iframeEnabled && appRouter.currentRoute.query.ticket) {
                    Vue.prototype.$message({
                        showClose: true,
                        message: '您的登录已超时，请重新登录',
                        type: 'error'
                      })
                      let domain = getItem('domain')
                      if(domain.domain == 'test'){
                          window.location.href = 'http://172.16.6.18:8010/#/login'
                      }else if(domain.domain == 'produce'){
                          window.location.href = 'https://fbs.glp168.com/#/login'
                      }
                } else {
                    Vue.prototype.$message({
                        showClose: true,
                        message: '您的登录已超时，请重新登录',
                        type: 'error'
                      })
                    appRouter.push('/login');
                }
            }
            return Promise.resolve(err.response);
        default: break;
    }
    return Promise.reject(err);
});

export default axios;