<template>
    <div id="app">
        <div class="test-test-test">
            <div class="maint-progress-bar">
                                <span>
                                <img src="@/assets/images/icon/weihu.png" style="width: 40px;">
                                    comming soon
                                </span>
                                <span> 施工中...</span>
                            </div>
                        </div>
        <div class="main">
            <div class="header">
                <div class="user-info">
                    <div class="info">
                        <div class="info-user_head"><el-avatar :src="userInfo.face"></el-avatar></div>
                        <div class="info-user_info">
                            <div>
                                <span>{{ userInfo.username }}</span>
                                <span>♀</span>
                                <span>lv 0</span>
                                <span>uid:{{ userInfo.uid }}</span>
                            </div>
                            <p class="profile"> {{userInfo.profile}} </p>
                        </div>
                    </div>
                    <div class="act">
                        <button @click="subscribe()">关注</button>
                    </div>
                </div>
            </div>
            <div class="navigator b">
                <div class="nav-act">投稿</div>
                <div class="nac-info">
                    <div class="nac-item">
                        <p>关注数</p>
                        <p>0</p>
                    </div>
                    <div class="nac-item">
                        <p>粉丝数</p>
                        <p>0</p>
                    </div>
                    <div class="nac-item">
                        <p>投稿数</p>
                        <p>0</p>
                    </div>
                    <div class="nac-item">
                        <p>播放数</p>
                        <p>0</p>
                    </div> 
                </div>
            </div>
            <div class="page-index">
                <div>她的视频</div>
                <div class="zone-list-box" v-if="total!==0">
                    <div v-for="(video, index) of video" :key="index" class="grid-content">
                        <router-link target="_blank" :to="{name: 'video',params:{nid:video.nid}}">
                            <img v-if="video.pic ==null || video.pic ==''" src="@/assets/images/test.png">
                        <img v-else :src="video.pic">
                        <div class="count">
                            <span><span><i class="el-icon-video-play"></i></span> <span>{{video.view}}</span></span>
                            <span>{{ formatTime(video.videoTime) }}</span>
                        </div>
                        <a class="title" :title="video.title">{{ video.title }}</a>
                        </router-link>
                    </div>
                </div>
                <div v-else>
                    <p>没有更多数据惹QAQ</p>
                </div>
                <el-pagination
                        class="pagination"
                        background
                        layout="prev, pager, next"
                        :page-size="30"
                        :hide-on-single-page="true"
                        @current-change="handleCurrentChange"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <div class="bottom-box"></div>
    </div>
</template>

<script>
import {getUserInfoInVideo} from '@/api/User';
import {getVideoListByUid} from '@/api/Video';
import {formatMillisecondTime} from '@/utils/utils'
export default{
    data(){
        return{
            userInfo:{},
            id:-1,
            video:[],
            index:1,
            total:-1
        }
    },
    mounted(){
        this.id = this.$route.params.uid
        this.getUserInfo(this.id)
        this.getUserVideo(this.id)
    },
    methods:{
        async getUserInfo(uid){
            await getUserInfoInVideo(uid).then(res=>{
                if(res.data.code ===20011){
                    this.userInfo = res.data.data
                }else{
                    this.userInfo=null
                    this.$message.warning(res.data.message)
                    this.$router.push("/404")
                }
            })
        },
        async getUserVideo(uid){
            let params = {
                page : this.index,
                uid : uid,
                
            }
            await getVideoListByUid(params).then(res =>{
                if(res.data.code ===20011){
                    this.video = res.data.data.data
                    this.total = res.data.data.totalCount
                    if(this.video === undefined){
                        this.video = null
                        this.total = 0 
                    }
                }else{
                    this.video=null
                    this.$message.warning(res.data.message)
                }
            })
        },
        handleCurrentChange(val){
            this.index = val
            this.getUserVideo(this.id)
        },
        subscribe(){
            this.$message.info("你似乎点了关注按钮呢,但是没什么用")
        },
        formatTime(t){
            return formatMillisecondTime(t)
        }
    }
}
</script>

<style lang="less" scoped>
.test-test-test{
    height: 60px;
    .maint-progress-bar{
            /* background-color:#FFA900; */
            align-content: center;
            color: #000 !important;
            background: repeating-linear-gradient(115deg,#ffc757 0px,#ffc757 10px,#FFA900 0px,#FFA900 20px);
            animation: maint-progress-bar-anim 2s linear infinite;
        }
        @keyframes maint-progress-bar-anim{
            from{
                background-position: 44px 0;
            }
            to{
                background-position: 0px 0;
            }
        }
}
#app{
    background-color: #F1F2F3;
    height:auto;
    .main{
        margin: 0 100px;
        min-height: 1000px;
    }
    .header{
        height: 240px;
        background: #aaa;
        display: flex;
        flex-direction:column;
        justify-content: flex-end;
        .user-info{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 0 10px;
            .info{
                display: flex;
                .info-user_head{
                    margin-right: 10px;
                }
                .info-user_info{
                    .profile{
                        color: #f1f2f3;
                    }
                }
            }
                            
        }
    }
    .navigator{
        height: 60px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        border-radius: 0 0 6px 6px;
        .nac-info{
            display: flex;
            align-items: center;
            text-align: center;
            box-sizing: border-box;
            padding: 10px 0;
        }
        .nac-item{
            margin-right: 10px;
            width: 58px;
            font-size: 14px;
        }
    }
    .page-index{
        background-color: #fff;
        min-height: 500px;
        @width: 220px;
        .grid-content {
            width: @width;
            display: inline-block;
            margin: 0 10px;
            img {
                height: 140px;
                border-radius: 4px;
                width: @width;
            }

            .count {
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                padding: 0 5px;
            }

            .title {
                display: block;
                font-size: 14px;
                line-height: 20px;
                margin: 10px 0 8px;
                height: 40px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                transition: all ease .5s;
            }

            .title:hover,.upload-user:hover{
            color: #2CA2EC;
            }

            .upload-user {
                display: flex;
                font-size: 12px;
                color: #999;
                transition: all ease .5s;
            }
        }
    }
    .b{
        margin-bottom: 10px;
    }

    .pagination{
        display: flex;
        width: 100%;
        height: 70px;
        justify-content: center;
    }
    .bottom-box{
        height: 60px;
    }
}
</style>
