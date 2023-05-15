<template>
<div id="nekoneko-player">
    <span id="cur-time">{{nowTime}}</span>
    <div ref="mycontainer" id="my-container"></div>
    <div ref="player" class="video">
    </div>
</div>
</template>

<script>
import {getNowTime} from '@/utils/utils'
import {selectByNid} from '@/api/Home'
import {updateVideoView} from '@/api/Video'

import { Player,Popover,EVENT } from 'nplayer'
import Danmaku from '@nplayer/danmaku'
import ASS from 'assjs'
import axios from 'axios'

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
    props:['nid'],
    data(){
        return{
            nowTime:'',
            subtitles:{
                ass:null,
                value:-1
            },
            // danmaItems:[],
            danmaItems:{
            },
            player:null,
            firstPlayFlag:true,
            shouldTriggerSeekedEvent: true
        }
    },
    created(){
        this.timer&&clearInterval(this.timer)
        this.initTimer()
    },
    mounted(){
      const _this= this
      _this.id = _this.$route.params.nid

      this.nowTime = getNowTime()
      this.getVideoInfo(_this.id)
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
                    ],
                    plugins:[new Danmaku(this.danmaItems)]
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
                this.player = player
                // ass = this.ass
                this.initVideoPlayerEvents(player)
                player.on(EVENT.SEEKED,()=>{
                    if(this.shouldTriggerSeekedEvent){
                        const currentTime = player.currentTime
                        this.$emit('change',currentTime)
                    }
                })
                player.on(EVENT.PLAY,async ()=>{
                    console.log(this.firstPlayFlag)
                    if(this.firstPlayFlag){
                        this.firstPlayFlag = false;
                        setTimeout(()=>{
                            updateVideoView(nid)
                        },5000)
                    }
                })
                player.on('DanmakuSend', (opts) => {
                    console.log(opts)
                })
            })
        },
        getProcessTime(time){
            this.shouldTriggerSeekedEvent = false
            this.player.currentTime = time
            setTimeout(() => {
            this.shouldTriggerSeekedEvent = true
            }, 500)
        }
    }
}
</script>

<style lang="less" scoped>
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
        height: 100%;
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
    @media screen and (max-width:550px){
        #nekoneko-player #cur-time{
        display: none;
        }
    }
</style>