import request from '@/utils/request'

const path="/api/v0/video"
/**
 * 
 * @param {*} dara 
 * @returns 
 */
export function getVideoList(params){
    return request({
        url:`${path}/selectByPage`,
        method:'get',
        params:{page:params}
    })
}

export function selectByNid(params){
    return request({
        url:`${path}/selectByNid`,
        method:'get',
        params:{nid:params}
    })
}