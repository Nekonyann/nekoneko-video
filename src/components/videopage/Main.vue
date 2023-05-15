<template>
    <div id="app"> 
        <div class="video-box">
            <div class="info">
                <div class="video-info">
                    <p class="video-title">{{videoInfo.title}}</p>
                    <div class="video-data">
                        <p class="video-data-list">
                            <span>分区:--</span>
                            <span>nya{{videoInfo.nid}}</span>
                            <span><i class="el-icon-video-play"></i>播放量:{{videoInfo.view}}</span>
                            <span>弹幕数:{{videoInfo.danmaku}}</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" class="data-icon" viewBox="0 0 512 512"><path fill="#999" d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>上传时间:{{videoInfo.upDate}}</span>
                        </p>
                    </div>
                </div>
                <div class="uploder-info">
                    <el-avatar :size="50" :src="videoInfo.owner.face"></el-avatar>
                    <div class="uploder-info_right">
                        <a>{{videoInfo.owner.username}}</a>
                        <span class="uploader-profile" :title="videoInfo.owner.profile">{{ videoInfo.owner.profile}}</span>
                    </div>
                    <div class="follow-button button"><el-button :loading="false">+ 关注 {{ videoInfo.owner.follows }}</el-button></div>
                </div>
            </div>
            <nVideoPlayer
                :nid="this.$route.params.nid"
                ref="nVideoPlayer"></nVideoPlayer>
        </div>
        <div class="info-box">
            <div class="left-info">
                <div class="arc_toolbar">
                    <span class="arc-item">在线 1</span>
                    <span class="like arc-item" title="0" @click="likeVideo(videoInfo.nid)"><svg xmlns="http://www.w3.org/2000/svg" class="arc-icon" viewBox="0 0 512 512"><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"/></svg>
点赞数 {{videoInfo.like}}</span>
                    <span class="unlike arc-item" title="0"><svg xmlns="http://www.w3.org/2000/svg" class="arc-icon" viewBox="0 0 512 512"><path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z"/></svg>点踩数 0</span>
                    <span class="fav arc-item" title="0"><svg xmlns="http://www.w3.org/2000/svg" class="arc-icon" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>收藏数 {{videoInfo.favorite}}</span>
                    <!-- 一起看 -->
                    <router-link class="arc-item tog_button" :to="{name: 'watchtog',params:{nid:videoInfo.nid}}"><span >一起看</span></router-link>
                </div>
                <!-- 视频简介 -->
                <div class="video-desc">
                    <div class="desc-info" ref="profile">{{ videoInfo.profile!=""?videoInfo.profile:"--"  }}</div>
                    <span class="show" @click="showProfile()">{{ showAllProfile?"收起":"展开" }}</span>
                </div>
                <!-- 评论区 -->
                <Common 
                :commentCount="videoInfo.commentCount"
                :nid="videoInfo.nid"
                v-if="videoInfo.nid!=''"
                :upid="videoInfo.owner.uid"></Common>
            </div>
            <div class="this-video_list">
                <div class="list">
                    <div class="list-nav" @click="showDanma()">
                        弹幕列表
                    </div>
                    <div class="list-main" v-show="showDanmaList">
                        <el-table
                            :data="tableData"
                            empty-text="当前没有弹幕哦~"
                            size="mini"
                            style="width: 100%;height: 100%;"
                            class="list-main">
                            <el-table-column
                                prop="time"
                                label="时间"
                                >
                            </el-table-column>
                            <el-table-column
                                prop="content"
                                label="弹幕内容"
                                >
                            </el-table-column>
                            <el-table-column
                                prop="upTime"
                                label="发送时间">
                            </el-table-column>
                            </el-table>
                    </div>
                </div>
                <div class="list">
                    <div class="list-nav">
                        视频选集
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import Common from '@/components/videopage/components/Common.vue';
import nVideoPlayer from '@/components/videopage/components/VideoPlayer.vue';
import {selectByNid} from '@/api/Home';
import {getVideoDanmaku,updateVideoLike} from '@/api/Video'

export default {
    name:'videopages',
    components:{
        Common,
        nVideoPlayer
    },
    data() {
        return {
            videoInfo:{
                src:'',
                title:'',
                nid:'',
                view:0,
                collection:0,
                danmaku:'',
                upDate:'',
                owner:{
                    uid:'',
                    username:'',
                    face:'',
                    profile:''
                },
                profile:'',
                commentCount:0,
                isSub:false,
                subtitleList:[],
                pages:[]
            },
            tableData:[],
            timer:null,
            nowTime:'',
            subtitles:{
                ass:null,
                value:-1
            },
            showAllProfile:false,//打开,收起
            showDanmaList:false,
            fullscreen:false
        }
    },
    mounted(){
      const _this= this
      _this.nid = _this.$route.params.nid
      this.getVideoInfo(_this.nid)
    },
    methods:{
        showDanma(){
            this.showDanmaList = !this.showDanmaList
        },
        showProfile(){
            this.showAllProfile = !this.showAllProfile
        },
        showProfileButton(){
            console.log(this.$refs.profile)
            return true
            // return this.$refs.profile.offsetHeight>64.8?false:true
        },
        async likeVideo(nid){
            await updateVideoLike(nid).then(res=>{console.log(res)})
        },
        async getVideoInfo(nid){
            await selectByNid(nid).then((res)=>{
                if(res.data.code===20011){
                    this.videoInfo=res.data.data
                    if(this.videoInfo.owner.profile==''){
                        this.videoInfo.owner.profile = "还没有简介呢"
                    }
                    if(res.data.data.subtitleList.length!=0){
                        this.videoInfo.isSub = true
                    }
                }else{
                    this.$message.error("数据为空")
                    this.$router.push("/404")
                }
            }).then(()=>{
                this.showProfileButton()
            })
            await getVideoDanmaku(nid).then(res=>{
                if(res.data.code===20011){
                    this.danmaku=res.data.data
                }else{
                    this.danmaku=null
                }
            })
        }
    }
        
}
</script>

<style lang="less" scoped>
@width-mobile:550px;
@width-medium:768px;
@width-large:1024px;
#app{
    margin: 0 100px;
}
@media screen and (max-width:@width-mobile) {
    #app{
        margin: 0;
        position: relative;
    }
    .video-box{
        #video-player{
        position: fixed;
        top: 0;
        }
    }
    
}
@media screen and (min-width:@width-large) {
#app::after {
		content: '';
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 1440px;
		margin: auto;
		background-image: linear-gradient(to right, transparent, rgba(255, 255, 255, .9) 100px, rgba(255, 255, 255, .5) calc(100% - 50px), transparent);
		z-index: -1;
	}
#app::before{
    content: "";
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: -100;
		background-image: url(@/assets/images/bg.png);
		background-position: center bottom;
		background-size: cover;
		background-attachment: fixed;
		background-repeat: no-repeat;
    }
}
.video-box{
    .info{
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
        .video-info{
            .video-title{
                font-size: 18px;
                margin-right: 20px;
            }
            .video-data{
                font-size: 14px;
                color: #999;
                width: 100%;
                padding-top: 10px;
                overflow: hidden;
                .video-data-list{
                    height: 24px;
                    line-height: 18px;
                    >span{
                    margin-right: 5px;
                    }
                }
                .data-icon{
                    width: 14px;
                    height: 14px;
                }
            }
        }
        .uploder-info{
            display: flex;
            box-sizing: border-box;
            padding-top: 15px;
            .uploder-info_right{
                margin-left: 10px;
                display: flex;
                flex-direction: column;
                width: 210px;
                .uploader-profile{
                color: #999;
                font-size: 14px;
                display: -webkit-box;
                -webkit-line-clamp: 1; 
                -webkit-box-orient: vertical; 
                overflow: hidden; 
                }
            }
        }
    }
}
.info-box{
    display: flex;
    .left-info{
        width:100%;
        .arc_toolbar{
            height: 40px;
            align-items: center;
            display: flex;
            margin-bottom: 10px;
            border-bottom: 1px solid #999;
            .arc-item{
                display: inline-flex;
                height: 30px;
                line-height: 30px;
                margin-left: 10px;
            }
            .arc-icon{
                width: 36px;
            }
            .tog_button{
                background-color: #79A9EC;
                display: block;
                border-radius: 5px;
                font-size: 14px;
                width: 65px;
                text-align: center;
                float: right;
                transition: all ease .5s;
            }
            .tog_button:hover{
                color: #fff;
                background-color: #0082e5;
            }
        }
        .video-desc{
            min-height: 40px;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #999;
            .desc-info{
                min-height: 40px;
                display: -webkit-box; 
                -webkit-line-clamp: 3; 
                -webkit-box-orient: vertical; 
                overflow: hidden; 
            }
        }
        .common{
           
        }
        
    }
    
    .this-video_list{
        width: 40%;
        margin-left: 30px;
        .list{
            margin: 10px 0;
            width: 100%;
            .list-nav{
                display: flex;
                align-items: center;
                background-color: #F1F2F3;
                border-radius: 6px;
                border: 1px solid #F1F2F3;
                height: 46px;
                box-sizing: border-box;
                font-size: 15px;
                padding-left: 10px;
                cursor: pointer;
            }
            .list-main{
                height: 376px;
                border: 1px solid #F1F2F3;
            }
        }
    }
    .show{
        color: #9499a0;
        cursor:pointer;
        margin-right: 10px;
        font-size: 14px;
        transition: all ease .3s;
    }
    .show:hover{
        color: #00a1d6;
    }
}
/deep/ .subtitles{
  position: relative;
  padding: 0 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  opacity: 0.8;
}
/deep/ .subtitles:hover {
  opacity: 1;
}
/deep/ .subtitles_item {
  padding: 5px 20px;
  font-weight: normal;
}
/deep/ .subtitles_item:hover {
  background: rgba(255, 255, 255, 0.3);
}
/deep/ .subtitles_item-active {
  color: #000;
}

</style>