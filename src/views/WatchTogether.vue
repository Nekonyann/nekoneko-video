<template>
    <div id="app">
        <el-container>
            <el-header>
                <Header></Header>
            </el-header>
            <el-main>
                <div class="main-box">
                    <div class="video-box">
                        <div class="info">
                            <div class="video-info">
                                <p class="video-title">{{ videoInfo.title }}</p>
                                <p class="video-data">
                                    <span>分区:隐藏分区</span>
                                    <span>视频号:{{ videoInfo.nid }}</span>
                                </p>
                            </div>
                            <div class="uploder-info">
                                <el-avatar :size="50"></el-avatar>
                                <div class="uploder-info_right">
                                    <a>{{ videoInfo.uploader.name }}</a>
                                    <span>简介</span>
                                </div>
                            </div>
                        </div>
                        <nVideoPlayer 
                        :nid="videoInfo.nid"
                        ref="nVideoPlayer"
                        @change="processControl"></nVideoPlayer>
                    </div>
                    <div class="info-box">
                        <div class="left-info">
                            同步进度
                            <el-switch
                                v-model="synchronous"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                                </el-switch>
                            <div class="video-desc">
                                <div class="desc-info">视屏简介</div>
                            </div>
                            <div class="online-communit-box">
                                <OnlineComList 
                                :nid="videoInfo.nid"
                                ref="OnlineComList"
                                @proTime="proTime"></OnlineComList>
                            </div>
                        </div>
                        <div class="this-video_list">

                        </div>
                    </div>
                </div>

            </el-main>
        </el-container>
    </div>
</template>
  
<script>
import Header from '@/components/Header.vue';
import OnlineComList from '@/components/videopage/components/OnlineComList.vue';
import nVideoPlayer from '@/components/videopage/components/VideoPlayer.vue';
import request from "@/utils/request";

export default {
    name:'watchtog',
    components: {
        Header,
        nVideoPlayer,
        OnlineComList
    },
    data() {
        return {
            videoInfo: {
                title: '',
                nid: '',
                uploadTime: '',
                uploader: {
                    face: '',
                    name: ''
                },
                pages: []
            },
            timer: null,
            synchronous:false
        }
    },
    mounted() {

    },
    created() {
        this.videoInfo.nid=this.$route.params.nid
        console.log(this.videoInfo.nid)
    },
    methods: {
        async processControl(time){
            if(this.synchronous){
            this.$refs.OnlineComList.sendProcessTime(time)
            }
        },
        proTime(time){
            if(this.synchronous){
                this.$refs.nVideoPlayer.getProcessTime(time)
            }
        }
    },
}

</script>
  
<style lang="less" scoped>
.el-header {
    padding: 0;
    height: 50px !important;
}

.el-container {
    height: 100%;
}

.el-main {
    padding: 0;

    .main-box {
        margin: 0 68px;

        .video-box {
            .info {
                display: flex;
                justify-content: space-between;

                .video-info {
                    .video-title {
                        font-size: 18px;
                    }

                    .video-data {
                        font-size: 14px;
                        color: #999;
                        width: 100%;

                        >span {
                            margin-right: 5px;
                        }
                    }
                }

                .uploder-info {
                    display: flex;
                    box-sizing: border-box;
                    padding-top: 15px;

                    .uploder-info_right {
                        margin-left: 10px;
                        display: flex;
                        flex-direction: column;
                        width: 210px;
                    }
                }
            }
        }

        .info-box {
            display: flex;

            .left-info {
                width: 100%;

                .arc_toolbar {
                    height: 40px;
                    align-items: center;
                    display: flex;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #999;

                    .arc-item {
                        height: 30px;
                    }
                }

                .video-desc {
                    min-height: 140px;
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #999;

                    .desc-info {
                        min-height: 100px;
                    }
                }
            }
        }
    }
}
</style>
  