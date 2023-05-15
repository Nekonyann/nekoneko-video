<template>
    <div id="app">
        <!-- 轮播图 -->
        <div class="recommend-info">
            <div class="recommend-container">
                <el-carousel 
                indicator-position="outside"
                :interval="3000"
                class="swipe">
                    <el-carousel-item v-for="(item,index) of carousel" :key="index">
                        <img :src="item.pic" style="height:100%;width:100%">
                        <p>{{ item.text }}</p>
                    </el-carousel-item>
                </el-carousel>
                <div class="grid-content" v-for="data in videoList" :key="data.id">
                        <router-link target="_blank" :to="{name: 'video',params:{nid:data.id}}"><img v-if="data.pic ==null || data.pic ==''" src="@/assets/images/test.png">
                            <img v-else :src="data.cover">
                            <div class="count">
                            <span><span><i class="el-icon-video-play"></i></span> <span>{{data.view}} {{ data.id }}</span></span>
                            <span>{{ formatTime(data.videoTime) }}</span>
                        </div>
                        <a class="title" :title="data.title">{{ data.title }}</a>
                        </router-link>
                    </div>
                </div>
        </div>
        <div class="card-list">
            <div class="card-head">
                <div class="name">首页视频</div>
            </div>
            <div class="zone-list-box" v-if="(total!=0)" style="overflow:auto; min-height: 300px;height: 100%"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="disable"
            infinite-scroll-distance="80"
            :style="{height: `calc(100vh)`}"> 
                <div v-for="(data, index) of data" :key="index" class="grid-content" style=" margin-right: 5px;">
                    <router-link target="_blank" :to="{name: 'video',params:{nid:data.nid}}"><img v-if="data.pic ==null || data.pic ==''" src="@/assets/images/test.png">
                        <img v-else :src="data.pic">
                        <div class="count">
                        <span><span><i class="el-icon-video-play"></i></span> <span>{{data.view}} {{ data.nid }}</span></span>
                        <span>{{ formatTime(data.videoTime) }}</span>
                    </div>
                    <a class="title" :title="data.title">{{ data.title }}</a>
                    </router-link>
                    <router-link :to="{name:'userhome',params:{uid:data.owner.uid}}">
                        <div class="upload-user"><span>up|</span> {{ data.owner.username }}</div>
                    </router-link>
                </div>
                <div v-if="loading" class="info">加载中</div>
                <div v-else class="info">没有更多数据惹QAQ.......</div>
            </div>
        </div>
        <div class="function-box">
            <button @click="loadMore()" class="get-more function-button">
                    <p>加 载</p><p>更 多</p>
            </button>
            <el-backtop :bottom="100" :right="20">
                <button
                class="function-button">
                    <p>返 回</p><p>顶 部</p>
                </button>
            </el-backtop>
        </div>
    </div>
</template>

<script>
import { getVideoList } from '@/api/Home'
import {formatMillisecondTime} from '@/utils/utils'
export default {
    data() {
        return {
            index: 1,
            items:20,
            loading: true,
            total:-1,
            data: [],
            carousel:[
                {pic:require('../../assets/images/upload_bg.jpg'),text:'123456',color:''},
                {pic:require('../../assets/images/123.jpg'),text:'123456',color:''},
                {pic:require('../../assets/images/upload_bg.jpg'),text:'123456',color:''},
                ],
            videoList: []
        }
    },
    created() {
        this.loading = true
        this.getVideo()
    },
    computed:{
        disable(){
            return this.loading
        }
    },
    methods: {
        //获取视频总列表
        async getVideo() {
            console.warn(this.index)
            await getVideoList(this.index,this.items).then((res) => {
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
            if((this.index-1)*this.items>=this.total){
                this.loading = false
                return
            }
            this.loading = true
            setTimeout(() => {
                this.getVideo()
            },1000)
        },
        formatTime(t){
            return formatMillisecondTime(t)
        }
    }
}
</script>

<style lang="less" scoped>

@width-mobile:426px;
@width-medium:768px;
@width-large:1024px;

#app{
    height: 100%;
}
@width: 220px;

.recommend-info{
    display: grid;
    .recommend-container{
        display: grid;
        width: 100%;
        grid-gap: 20px 12px;
    }

    @media (max-width:@width-mobile) {
        .recommend-container{
            display: none;
        }
    }
    @media (max-width: 1099.9px) {
        .recommend-container{
            grid-column:span 4;
            grid-template-columns: repeat(4,1fr)
        }
        .recommend-container>*:nth-of-type(1n + 6) {
            display: none!important;
        }
    }
    @media (min-width: @width-large) and (max-width: 1366.9px) {
        .recommend-container {
            grid-column: span 5;
            grid-template-columns: repeat(5,1fr);
        }
        .recommend-container>*:nth-of-type(1n + 8) {
            display: none!important;
        }
    }
    @media (min-width: 1367px) and (max-width: 1700.9px){
    .recommend-container {
        grid-column: span 5;
        grid-template-columns: repeat(5,1fr);
    }
    }
    @media (min-width: 1701px) and (max-width: 2199.9px) {
    .recommend-container {
        grid-column:span 6;
        grid-template-columns: repeat(6,1fr)
    }

    .recommend-container>*:nth-of-type(1n + 10) {
        display: none!important
    }
}
    @media (min-width: 2200px) {
        .recommend-container {
            grid-column: span 7;
            grid-template-columns: repeat(7,1fr);
        }
    .recommend-container {
        grid-gap:20px 16px
    }
}

    .swipe{
        grid-column: 1/3;
        grid-row: 1/3;
    }
    .recommend-video
    {
        width: 100%;
    }
    .el-carousel{
        position: relative;
        width: 100%;
        border-radius: .5rem;
    }
    .el-carousel__item p {
     position: absolute;
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    margin: 0;
  }

  /deep/ .el-carousel__indicators--outside{
    text-align: left;
    background: #6f6f6f;
    .el-carousel__button{
        width: 14px;
        height: 8px;
        border-radius: .5rem;
        background-color: #ffffff90;
    }
    // .el-carousel__indicators--outside button{
        
    // }
    .el-carousel__indicator.is-active button{
        width: 24px;
        background-color: #fff;
    }
  }
  
  .el-carousel__item {
    background-color: #d3dce6;
  }
}

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

    .zone-list-box{
       display: grid;
       @media (max-width:@width-mobile) {
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 10px;
        .grid-content{
            width: 180px;
            img{
                height: 120px;
            }
        }
        .info{
         grid-column-start: span 2;
        }
       }
       @media (min-width:425.9px) and (max-width:560px){
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 10px;
        .info{
         grid-column-start: span 2;
        }
       }
       @media screen and(min-width: @width-medium) and (max-width:984px) {
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;
        .info{
         grid-column-start: span 3;
        }
       }
       @media (min-width:984.9px) and(max-width:1366px){
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 10px;
        .info{
         grid-column-start: span 4;
        }
       }
       @media (min-width:1366.9px) and (max-width: 1460px) {
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 10px;
        .info{
         grid-column-start: span 5;
        }
       }
        @media (min-width: 1460px) {
        grid-template-columns: repeat(6, 1fr);
        grid-gap: 10px;
        .info{
         grid-column-start: span 6;
        }
        }
    }
}

.grid-content {
    width: @width;
    display: inline-block;
    img {
        height: 140px;
        border-radius: 4px;
        width: 100%;
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

.info{
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
}
.function-box{
    display:flex;
    /deep/ .el-backtop{
        width: 60px;
        height: 60px;
        bottom: 140px !important;
    }
    .function-button{
    position: fixed;
    right: 20px;
    align-self: center;
    width: 60px;
    height: 60px;
    background-color: #2CA2EC;
    border-radius: .3333rem;
    font-size: 15px;
    color: #fff;
        >p{
            padding: 1px;
        }
    }
    .function-button:hover{
        background-color: #01B9F5;
    }
    .get-more{
        bottom: 70px;
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