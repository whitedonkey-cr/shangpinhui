import axios from "axios";

// 引入进度条插件和样式 顶部加载就出现进读条
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const mockreq = axios.create({
    //只需要修改默认地址即可 然后再当前index文件夹中引入
    baseURL: '/mock',
    timeout: 5000,
});

// 请求拦截器
mockreq.interceptors.request.use((config) => {
    nProgress.start()
    return config;
})

// 响应拦截器 
mockreq.interceptors.response.use((res) => {
    nProgress.done()
    return res.data
}, (err) => {
    return Promise.reject(new Error('faile'))
})

export default mockreq