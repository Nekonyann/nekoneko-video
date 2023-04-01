import request from '@/utils/request'

const path="/api/v0/upload"

export function checkFileExists(data){
    return request({
        url:`${path}/checkVideo`,
        method:'post',
        data
    })
}

export function checkChunk(data){
    return request({
        url:`${path}/checkChunk`,
        method:'post',
        data
    })
}

export function uploadChunk(data,onUploadProgress){
    return request({
        url:`${path}/uploadChunk`,
        method:'post',
        data,
        headers:{
            'Content-Type':'multipart/form-data'
        },
        onUploadProgress:onUploadProgress
    })
}

export function mergeChunk(data){
    return request({
        url:`${path}/mergeChunk`,
        method:'post',
        data,
    })
}

export function uploadSingeFile(data,onUploadProgress){
    return request({
        url:`${path}/updateFile`,
        method:'post',
        data,
        headers:{
            'Content-Type':'multipart/form-data'
        },
        onUploadProgress: onUploadProgress
    })
}