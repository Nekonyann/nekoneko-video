<template>
    <div id="app">
        <!-- 轮播图(预留) -->
        <div></div>
        <div class="card-list">
            <div class="card-head">
                <div class="name">首页视频</div>
                <button @click="loadMore()">加载更多</button>
            </div>
            <div class="zone-list-box" v-if="(data.length!=0)">
            <!-- v-infinite-scroll="loadMore()"
            infinite-scroll-disabled="loading" 
            infinite-scroll-delay="300" -->
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
            <p v-if="loading">加载中</p>
            <div v-else>没有更多数据惹QAQ.......</div>
        </div>
    </div>
</template>

<script>
import { getVideoList } from '@/api/Home'
export default {
    data() {
        return {
            index: 1,
            loading: true,
            total:-1,
            data: []
        }
    },
    created() {
        this.getVideo()
    },
    methods: {
        //获取视频总列表
        async getVideo() {
            this.loading = true
            await getVideoList(this.index).then((res) => {
                if (res.data.code == 20011) {
                    this.total = res.data.data.totalCount
                    const data = res.data.data.data
                    this.data = this.data.concat(data)
                    this.index+=1
                    this.loading = false
                } else {
                    this.data = null
                    this.$message.error('数据获取失败')
                    this.loading = false
                }
            })
        },
        loadMore(){
            if (this.loading) {
                return
            }
            if((this.index-1)*10>=this.total){
                this.loading = false
                return
            }
            this.getVideo()
        }
    }
}
</script>

<style lang="less" scoped>
@width: 220px;

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

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

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    height: 240px;
    width: @width;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>