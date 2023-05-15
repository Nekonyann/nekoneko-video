<template>
  <div id="app">
    <div v-for="(subtitlesList, index) of subtitlesList" :key="index" class="card">
        <!-- <img :src="video.img"> -->
        <!-- <router-link target="_blank" :to="{name: 'video',params:{nid:video.nid}}" class="title-image-box">
          <img src="@/assets/images/test.png" class="title-image">
          <span class="video-time">{{ video.videoTime }}</span>
        </router-link> -->
        <div class="main-info">
          <div class="info">
            <!-- <router-link target="_blank" :to="{name: 'video',params:{nid:video.nid}}">
            <a class="title" :title="video.title">{{ video.title }}</a>
            </router-link> -->
             <span class="nid-tags">nid {{ subtitlesList.nid }}</span>
            <p>上传时间:{{ subtitlesList.uploadTime }}</p>
            <div class="count">
              <span class="nid-tags">{{ subtitlesList.lang == "chs"? "chs 简中-日" :"cht 繁中-日" }}</span>
            </div>
          </div>
          <div class="button-box">
            <el-button type="danger">删除</el-button>
          </div>
        </div>
    </div>
    <el-pagination
          class="pagination"
          background
          layout="total,prev, pager, next,jumper"
          :page-size="20"
          :hide-on-single-page="true"
          @current-change="handleCurrentChange"
          :total="total">
        </el-pagination>
  </div>
</template>

<script>
import {selectSubtitlesPageByUid} from '@/api/Platform';
export default {
  data(){
    return{
      subtitlesList:[],
      total:0,
      uid:0,
      index:1
    }
  },
  mounted(){
    this.uid = this.$store.state.isLogin.uid
    this.getUserSubtitles(this.uid)
  },
  methods:{
    async getUserSubtitles(uid){
      let params = {
                page : this.index,
                uid : uid, 
            }
      await selectSubtitlesPageByUid(params).then(res=>{
        if(res.data.code ===20011){
            this.subtitlesList = res.data.data.data
            this.total = res.data.data.totalCount
            if(this.subtitlesList === undefined){
                this.subtitlesList = null
                this.total = 0 
            }
        }else{
            this.subtitlesList=null
            this.$message.warning(res.data.message)
        }
      })
    },
    handleCurrentChange(val){
            this.index = val
            this.getUserVideo(this.uid)
        },
  }
}
</script>

<style lang="less" scoped>
.card{
  padding: 10px 10px;
  display:flex;
  margin: 10px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .title-image-box{
    position: relative;
    width: 154px;
    height: 96px;
    border-radius: .33333rem;
    margin-right: 20px;
    .title-image{
      width: 100%;
      height: 100%;
      border-radius: .33333rem;
    }
    .video-time{
      position: absolute;
      bottom: 0;
      right: 0;
      color: #fff;
      font-size: 14px;
      background-color: #66B1FF80;
      border-radius: .33333rem;
    }
  }
.main-info{
  display: flex;
  justify-content: space-between;
  width: 100%;
  .info{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .nid-tags{
      height: 20px;
      border-radius: .33333rem;
      margin-right: 5px;
      background-color: #66B1FF;
    }
    .title{
      margin-left: 10px;
    }
    .count{
      >span{
        margin: 0 5px;
      }
    }
  }
  .button-box{
    display: flex;
    align-items: center;
    margin: 0 20px;
  }
}
}
</style>