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
                                <p class="video-title">测试用视频{{ videoInfo.title }}</p>
                                <p class="video-data">
                                    <span>分区:隐藏分区</span>
                                    <span>视频号:{{ videoInfo.nyaId }}</span>
                                    <span><i class="el-icon-video-play"></i>播放量:{{ videoInfo.view }}</span>
                                    <span>弹幕数:{{ videoInfo.danmaku }}</span>
                                    <span>上传时间:{{ videoInfo.uploadTime }}</span>
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
                        <div id="nekoneko-player">
                            <span id="cur-time">{{ timer }}</span>
                            <video src=""></video>
                        </div>
                    </div>
                    <div class="info-box">
                        <div class="left-info">
                            <div class="arc_toolbar">
                                <span class="like arc-item" title="点赞数"><i class=""></i>111{{ videoInfo.like }}</span>
                                <span class="unlike arc-item" title="点踩数"><i class=""></i>111{{ videoInfo.unlike
                                }}</span>
                                <span class="fav arc-item" title="收藏数"><i class=""></i>111{{ videoInfo.favorite
                                }}</span>
                            </div>
                            <div class="video-desc">
                                <div class="desc-info">视屏简介</div>
                            </div>
                            <div class="online-communit-box">
                                <OnlineComList></OnlineComList>
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
import request from "@/utils/request";

export default {
    name:'watchtog',
    components: {
        Header,
        OnlineComList
    },
    data() {
        return {
            videoInfo: {
                title: '',
                nyaId: '',
                view: '',
                danmaku: '',
                uploadTime: '',
                uploader: {
                    face: '',
                    name: ''
                },
                pages: []
            },
            timer: null
        }
    },
    mounted() {
        
    },
    created() {

    },
    methods: {

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

            #nekoneko-player {
                position: relative;

                #cur-time {
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

                >video {
                    width: 100%;
                    height: 556px;
                    background-color: aqua;
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
  