import request from '@/utils/request'

const path="/api/v0/video"
/**
 * 
 * @param {*} page 
 * @returns 
 */
export function getVideoList(page,items){
    return request({
        url:`${path}/selectVideoByPage`,
        method:'get',
        params:{
            page,
            items
        }
    })
}

export function selectByNid(params){
    return request({
        url:`${path}/selectByNid`,
        method:'get',
        params:{nid:params}
    })
}