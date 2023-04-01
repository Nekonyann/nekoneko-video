// 封装axios
import router from "@/router";
import axios from "axios";
import{ Message } from 'element-ui'

const instance = axios.create({
    baseURL:'http://127.0.0.1:9000',
    timeout:10000,
    withCredentials: true,
    headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded'  
    }
})

//拦截器 - 请求拦截
instance.interceptors.request.use(config=>{
    let authorization = localStorage.getItem('authorization')
    if(authorization){
        config.headers['Authorization'] = authorization
    }
    return config
}, err=>{
    return Promise.reject(err)
});


// 拦截器 - 响应拦截
instance.interceptors.response.use(res =>{
    if(res.data.code === 401){
        Message.error('请登录')
    }
    if(res.data.code === 403){
        Message.error('请重新登录')
        localStorage.removeItem('authorization')
        localStorage.removeItem('token')    
        router.push({path:'/login'})
        return
    }
    return res
},err=>{
    if(err&&err.response){
        //公共错误处理 根据响应码
        switch(err.response.status){
            case 400:
                err.message = '错误请求'
                break;
            case 401:
                err.message = '未授权'
                break;
            case 403:
                err.message = '拒绝访问'
                break;
            case 500:
                err.message = '服务器错误'
                break;
            case 503:
                err.message = '服务不可用'
                break;
            default:
                err.message = `连接错误 错误代码:${err.code}`
        }
    }
    Message.error(err.message)
    return Promise.reject(err)
})

export default instance