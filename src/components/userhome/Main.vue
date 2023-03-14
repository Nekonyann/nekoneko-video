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
                <div class="zone-list-box" v-if="video.length!=0" >
                    <div v-for="(video, index) of video" :key="index" class="grid-content">
                        <router-link target="_blank" :to="{name: 'video',params:{nid:video.nid}}"><img src="@/assets/images/test.png">
                        <div class="count">
                            <span><span><i class="el-icon-video-play"></i></span> <span>{{video.view}}</span></span>
                            <span>{{ video.videoTime }}</span>
                        </div>
                        <a class="title" :title="video.title">{{ video.title }}</a>
                        </router-link>
                    </div>
                </div>
                <div v-else>
                    <p>没有更多数据惹QAQ</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getUserInfoInVideo} from '@/api/User';
export default{
    data(){
        return{
            userInfo:{},
            video:[]
        }
    },
    mounted(){
        const _this= this
        _this.id = _this.$route.params.uid
        console.log(_this.$route.params.uid)
        this.getUserInfo(_this.id)
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
        subscribe(){
            this.$message.info("你似乎点了关注按钮呢,但是没什么用")
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
    }
    .b{
        margin-bottom: 10px;
    }
}
</style>
