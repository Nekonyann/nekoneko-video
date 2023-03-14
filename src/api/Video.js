import request from '@/utils/request'

const path="/v0/video"

export function uploadVideoInfo(data){
    return request({
        url:`${path}/handleVideoInfo`,
        method:'post',
        data
    })
}

export function selectByKeywords(params){
    return request({
        url:`${path}/selectByKeywords`,
        method:'get',
        params:{ keywords:params }
    })
}

const cpath="/api/v0/comment"
export function selectCommentByNid(params){
    return request({
        url:`${cpath}/selectCommentByNid`,
        method:'get',
        params:{nid:params}
    })
}

export function sendComment(data){
    return request({
        url:`${cpath}/insertComment`,
        method:'post',
        data
    })
}

export function sendCommentReply(data){
    return request({
        url:`${cpath}/insertCommentReply`,
        method:'post',
        data
    })
}

export function deleteComment(params){
    return request({
        url:`${cpath}/deleteCommentMain`,
        method:'post',
        params:{commentId:params}
    })
}

export function deleteCommentReply(params){
    return request({
        url:`${cpath}/deleteCommentReply`,
        method:'post',
        params:{commentReplyId:params}
    })
}