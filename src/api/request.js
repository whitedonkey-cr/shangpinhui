// 对axios进行二次封装
import axios from "axios";

// 引入进度条插件和样式 顶部加载就出现进读条
import nProgress from "nprogress";
import "nprogress/nprogress.css";

//引入store文件
import store from '@/store'
//1.利用axios对象的方法 create ，去创建一个axios实例
//2.request就是axios，只不过稍微配置一下
const requests = axios.create({
    baseURL: '/api',
    //代表请求超时的时间是5s
    timeout: 5000,
});

// 请求拦截器：在发请求之前，请求拦截器可以检测到，在请求发出去之前做一些事情
requests.interceptors.request.use((config) => {
    nProgress.start()
    //config:是一个配置对象，对象里面有一个属性很重要 就是Header请求头
    config.headers.userTempId = store.state.detail.uuid_token
    if (localStorage.getItem('token'))
        config.headers.token = localStorage.getItem('token')
    return config;
})

// 响应拦截器 
requests.interceptors.response.use((res) => {
    nProgress.done()
    //成功的回调函数：服务器相应数据回来以后，响应拦截器可以检测到，可以做一些事情
    return res.data
}, (err) => {
    //失败的回调，终止promise链
    return Promise.reject(new Error('faile'))
})

export default requests