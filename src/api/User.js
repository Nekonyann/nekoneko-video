import request from '@/utils/request'

const path = '/api/v0/user'
/**
 * 用户登录
 * @param {*} data 
 * @returns 
 */
export function Login(data){
    return request({
        url:`${path}/login`,
        method:'post',
        data
    })
}

//登出
export function Logout(data){
    return request({
        url:`${path}/logout`,
        method:'post',
        data
    })
}
/**
 * 用户注册
 * @param {*} data 
 * @returns 
 */
export function Register(data){
    return request({
        url:`${path}/register`,
        method:'post',
        data
    })
}

/**
 * 修改账号
 * @param {*} data 
 * @returns 
 */
export function Update(data){
    return request({
        url:`${path}/update`,
        method:'post',
        data
    })
}

// 销号
export function Delete(data){

}

export function getUserInfoInVideo(params){
    return request({
        url:`${path}/getUserInfo`,
        method:'post',
        params:{uid:params}
    })
}