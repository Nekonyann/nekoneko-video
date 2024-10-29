<template>
  <div id="app">
    <div v-for="(video, index) of video" :key="index" class="card">
        <!-- <img :src="video.img"> -->
        <router-link target="_blank" :to="{name: 'video',params:{nid:video.nid}}" class="title-image-box">
          <img v-if="video.pic ==null || video.pic ==''" src="@/assets/images/test.png" class="title-image">
          <img v-else :src="video.pic" class="title-image">
          <span class="video-time">{{ formatTime(video.videoTime) }}</span>
        </router-link>
        <div class="main-info">
          <div class="info">
            <router-link target="_blank" :to="{name: 'video',params:{nid:video.nid}}">
            <span class="nid-tags">nid {{ video.nid }}</span>
            <span class="nid-tags">分区 --</span>
            <a class="title" :title="video.title">{{ video.title }}</a>
            </router-link>
            <p>上传时间:{{ video.upDate }}</p>
            <div class="count">
              <span><span><i class="el-icon-video-play"></i></span><span>{{video.view}}</span></span>
              <span><span><i class="el-icon-video-play"></i></span><span>弹幕数:{{video.danmaku}}</span></span>
              <span><span><i class="el-icon-video-play"></i></span><span>收藏数:{{video.collection}}</span></span>
              <span>点赞数:{{ video.like }}</span>
            </div>
          </div>
          <div class="button-box">
            <el-button type="primary" @click="editVideo(video.nid)">编辑</el-button>
            <el-button type="danger" @click="deleteVideo(video.title,video.nid)">删除</el-button>
          </div>
        </div>
    </div>
      <el-pagination
          class="pagination"
          background
          layout="total,prev, pager, next,jumper"
          :page-size="30"
          :hide-on-single-page="true"
          @current-change="handleCurrentChange"
          :total="total">
        </el-pagination>
  </div>
</template>

<script>
import {getVideoListByUid, deleteVideoInfo} from '@/api/Video';
import {formatMillisecondTime} from '@/utils/utils'
export default {
  data(){
    return{
      video:[],
      total:0,
      uid:0,
      index:1
    }
  },
  mounted(){
      this.uid = this.$store.state.isLogin.uid
      this.getUserVideo(this.uid)
    },
  methods:{
    async getUserVideo(uid){
      let params = {
                page : this.index,
                uid : uid, 
            }
      await getVideoListByUid(params).then(res=>{
        if(res.data.code ===20011){
            this.video = res.data.data.data
            this.total = res.data.data.totalCount
            if(this.video === undefined){
                this.video = null
                this.total = 0 
            }
        }else{
            this.video=null
            this.$message.warning(res.data.message)
        }
      })
    },
    editVideo(nid){
        const route = {
        path: '/videoupload/uploadpage',
        query: { "type":"edit", nid }
      };
      this.$router.push(route);
    },
    deleteVideo(title,nid){
      this.$confirm(`此操作将永久删除[${title}], 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteVideoInfo(nid).then(res=>{
            if(res.data.code === 20021){
              this.$message({
              type: 'success',
              message: `${res.data.message}`
            });
            this.getUserVideo(this.uid)
            }else{
              this.$message({
                type: 'error',
                message: `${res.data.message}`
              })
            }
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleCurrentChange(val){
      this.index = val
      this.getUserVideo(this.uid)
    },
    formatTime(t){
      return formatMillisecondTime(t)
    }
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