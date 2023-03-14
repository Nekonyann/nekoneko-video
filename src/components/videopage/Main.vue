<template>
    <div id="app"> 
        <div class="video-box">
            <div class="info">
                <div class="video-info">
                    <p class="video-title">{{videoInfo.title}}</p>
                    <p class="video-data">
                        <span>分区:--</span>
                        <span>nya{{videoInfo.nid}}</span>
                        <span><i class="el-icon-video-play"></i>播放量:{{videoInfo.view}}</span>
                        <span>弹幕数:{{videoInfo.danmaku}}</span>
                        <span>上传时间:{{videoInfo.upDate}}</span>
                    </p>
                </div>
                <div class="uploder-info">
                    <el-avatar :size="50" :src="videoInfo.owner.face"></el-avatar>
                    <div class="uploder-info_right">
                        <a>{{videoInfo.owner.username}}</a>
                        <span class="uploader-profile" :title="videoInfo.owner.profile">{{ videoInfo.owner.profile}}</span>
                    </div>
                </div>
            </div>
            <div id="nekoneko-player">
                <span id="cur-time">{{nowTime}}</span>
                <div ref="mycontainer" id="my-container">
                </div>
                <div ref="player" class="video">
                </div>
                
            </div>
        </div>
        <div class="info-box">
            <div class="left-info">
                <div class="arc_toolbar">
                    <span class="like arc-item" title="0"><i class=""></i>点赞数 {{videoInfo.like}}</span>
                    <span class="unlike arc-item" title="0"><i class=""></i>点踩数 --</span>
                    <span class="fav arc-item" title="0"><i class=""></i>收藏数 {{videoInfo.favorite}}</span>
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
                :nid="this.$route.params.nid"
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
import {selectByNid} from '@/api/Home';
import {getNowTime} from '@/utils/utils'

import { Player,Popover,EVENT } from 'nplayer'
import ASS from 'assjs'
import axios from 'axios';

// const Quantity = {
//   el: document.createElement("div"),
//   init() {
//     this.btn = document.createElement("div")
//     this.btn.textContent = "画质";
//     this.el.appendChild(this.btn)
//     this.popover = new Popover(this.el)
//     this.btn.addEventListener("click", () => this.popover.show())
//     // 点击按钮的时候展示 popover
//     this.el.style.display = "none"
//     // 默认隐藏
//     this.el.classList.add("quantity")
//   }
// };

const Subtitles = {
    el:document.createElement("div"),
    init(){
        this.btn = document.createElement("div")
        this.btn.textContent = "无字幕"
        this.el.appendChild(this.btn)
        this.popover = new Popover(this.el)
        this.btn.addEventListener("click", () => this.popover.show())
        this.el.classList.add("subtitles")
    }
    
};
export default {
    name:'videopages',
    components:{
        Common
    },
    data() {
        return {
            videoInfo:{
                src:'',
                title:'',
                nyaId:'',
                view:'',
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
      _this.id = _this.$route.params.nid
      console.log(_this.$route.params.nid)
      this.nowTime = getNowTime()
      this.getVideoInfo(_this.id)
    },
    created(){
        this.timer&&clearInterval(this.timer)
        this.initTimer()
    },
    beforeDestroy(){
        this.timer&&clearInterval(this.timer)
    },
    methods:{
        setTimer(){
            this.timer&&clearInterval(this.timer)
            if(this.timer == null){
                this.timer = setInterval(()=>{
                    this.nowTime = getNowTime()
                },1000)
            }
        },
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
        // 初始化时间
        initTimer(){
            this.nowTime = this.setTimer()
        },
        //播放界面监听
        initVideoPlayerEvents(player){
            player.on(EVENT.WEB_ENTER_FULLSCREEN,()=>{
                this.subtitles.ass.resize()
                this.subtitles.ass.show()
            })
            player.on(EVENT.WEB_EXIT_FULLSCREEN,()=>{
                this.subtitles.ass.resize()
                this.subtitles.ass.show()
            })
            player.on(EVENT.ENTER_FULLSCREEN,()=>{
                this.subtitles.ass.width = window.innerWidth
                this.subtitles.ass.height = window.innerHeight
                this.$refs.mycontainer.style= "z-index: 100000;"
                this.subtitles.ass.resize()
                this.subtitles.ass.show()
                this.fullscreen = !this.fullscreen
                // console.log("a:%o",this.subtitles)
            })
            player.on(EVENT.EXIT_FULLSCREEN,()=>{
                this.subtitles.ass.resize()
                this.subtitles.ass.show()
                this.fullscreen = !this.fullscreen
            })
        
        },
        // 初始化播放器
        initVideoPlayer(){
            const player = new Player({
                    src: this.videoInfo.src,
                    videoProps: { autoplay: 'true' },
                    controls:  [
                        ['play', 'volume', 'time', 'spacer',Subtitles, 'airplay', 'settings', 'web-fullscreen', 'fullscreen'],
                        ['progress']
                    ]
                })
                if(this.videoInfo.isSub == true){
                    const frag = document.createDocumentFragment()
                const listener = (i) => (init) => {
                    const last = Subtitles.itemElements[Subtitles.itemElements.length - 1];
                    const prev = Subtitles.itemElements[Subtitles.value] || last;
                    const el = Subtitles.itemElements[i] || last;
                    prev.classList.remove("subtitles_item-active");
                    el.classList.add("subtitles_item-active");
                    Subtitles.btn.textContent = el.textContent;
                    let value = Subtitles.value = i;
                    if(value !=this.subtitles.value){
                    let src = this.videoInfo.subtitleList[i] ? this.videoInfo.subtitleList[i].src : null
                    this.setSubtitles(value,src)
                    }
                    Subtitles.popover.hide();
                };
                Subtitles.itemElements = this.videoInfo.subtitleList.map((l,i)=>{
                    const el = document.createElement("div");
                    el.textContent = l.lang
                    if (l.lang == 'chs') el.textContent += " 简中";
                    if (l.lang == 'cht') el.textContent += " 繁中";
                    if (l.lang == 'eng') el.textContent += " 英语"
                    el.classList.add("subtitles_item");
                    el.addEventListener("click", listener(i));
                    frag.appendChild(el);
                    return el;
                })

                const el = document.createElement("div")
                el.textContent = "关闭"
                el.addEventListener("click", listener(-1))
                el.classList.add("subtitles_item")
                frag.appendChild(el)
                Subtitles.itemElements.push(el)
                Subtitles.popover.panelEl.appendChild(frag);
                //初始化字幕选择
                listener(0)(true);
                }
                
                player.mount(this.$refs.player)
                return player
        },
        //操作字幕
        setSubtitles(value,sub){
            //初始化字幕
            if(sub!=null&&value!=this.subtitles.value&&!this.subtitles.ass){
                this.initSubtitles(sub)
                this.subtitles.value = value
            //切换字幕
            }else if(sub!=null&&value!=this.subtitles.value){
                this.subtitles.ass.destroy()
                this.initSubtitles(sub)
                this.subtitles.value = value
            //关闭字幕
            }else{
                this.subtitles.ass.destroy()
                this.subtitles.ass=null
                this.subtitles.value = value
            }
        },
        //初始化字幕
        async initSubtitles(sub){
            await axios.get(sub)
                    .then(res=>{
                    const video = document.querySelector('.nplayer_video')
                    const ass = new ASS(res.data, video,{
                        container: this.$refs.mycontainer,
                        resampling: 'video_height',
                    });
                this.subtitles.ass = ass
                })
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
                const player = this.initVideoPlayer()
                // ass = this.ass
                this.initVideoPlayerEvents(player)
                this.showProfileButton()
            })
        }
    }
        
}
</script>

<style lang="less" scoped>
#app{
    margin: 0 100px;
}
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
                >span{
                    margin-right: 5px;
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
    #nekoneko-player{
        position: relative;
        #cur-time{
            position: absolute; 
            top: 0px; 
            right: 0px; 
            z-index: 10; 
            font-size: x-large; 
            font-weight: bold; 
            margin: 1rem; 
            color: rgb(156, 156, 156); 
            opacity: 0.48;
        }
        >.video{
        width: 100%;
        height: 556px;
        background-color: #000;
        }
        #my-container {
            pointer-events: none;
            position: absolute;
            z-index: 9;
        }
        .web-full{
            
        }
        // .nekopx-control-context-area{
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     width: 100%;
        //     height: 100%;
        //     z-index: 1000;
        //     pointer-events: none;
        // }
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
                height: 30px;
                line-height: 30px;
                margin-left: 10px;
            }
            .tog_button{
                background-color: #79A9EC;
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