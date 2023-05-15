import request from '@/utils/request'

const path="/api/v0/platform"

export function selectSubtitlesPageByUid(params){
    let uid = params.uid
    let page = params.page
    return request({
        url:`${path}/selectSubtitlesPageByUid`,
        method:'get',
        params:{
            page:page,
            uid:uid
        }
    })
}