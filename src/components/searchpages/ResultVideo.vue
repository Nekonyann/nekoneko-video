<template>
    <div id="app">
        <div class="header">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="all">
                    <div class="card-list">
                        <div class="zone-list-box" v-if="(data.length!=0)">
                            <div v-for="(data, index) of data" :key="index" class="grid-content">
                                <router-link target="_blank" :to="{name: 'video',params:{nid:data.nid}}"><img src="@/assets/images/test.png">
                                <div class="count">
                                    <span><span><i class="el-icon-video-play"></i></span> <span>{{data.view}}</span></span>
                                    <span>{{ data.videoTime }}</span>
                                </div>
                                <a class="title" :title="data.title">{{ data.title }}</a>
                                </router-link>
                                <router-link :to="{name:'userhome',params:{uid:data.owner.uid}}">
                                    <div class="upload-user"><span>up|</span> {{ data.owner.username }}</div>
                                </router-link>
                            </div>
                        </div>
                        <div v-else>没有更多数据惹QAQ.......</div>
                    </div>
                </el-tab-pane>
                <!-- <el-tab-pane label="视频" name="video">视频</el-tab-pane> -->
            </el-tabs>
        </div>
        
    </div>
</template>

<script>
import { selectByKeywords } from '@/api/Video.js'
export default {
    data(){
        return{
            activeName: 'all',
            keywords:'',
            data: []
        }
    },
    mounted(){
        this.keywords = this.$route.query.keywords
        this.searchVideoByKeywords()
    },
    methods:{
        handleClick(tab, event) {
            console.log(tab, event);
        },
        async searchVideoByKeywords(){
            await selectByKeywords(this.keywords).then(res=>{
                if(res.data.code ===20011){
                    this.data = res.data.data
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.card-list {
    .card-head {
        display: flex;
        height: 36px;
        align-items: center;

        .name {
            font-size: 20px;
        }
    }
}
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
        font-size: 12px;
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
</style>