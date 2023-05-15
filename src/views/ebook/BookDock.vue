<template>
    <div id="app">
      <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      direction="ltr">
      <el-tabs 
      :stretch="true"
      v-model="navItemsName">
        <el-tab-pane label="章  节" name="chapter">
          <div v-for="(chapter, index) of this.chapterList" :key="index">
            <p @click="jumpTo(chapter.href)" class="">{{ index }} {{ chapter.label }}</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="小说信息" name="info">
          <div>
            <img :src="cover">
          </div>
          <h3>{{ this.bookInfo.title }}</h3>
          <p>{{ this.bookInfo.creator }}</p>
          <div>{{ this.bookInfo.description }}</div>
        </el-tab-pane>
        <el-tab-pane label="基本设置" name="setting">
          <div>
            <span>主题</span>
            <el-button v-for="(themeList,index) of this.themeList" :key="index" :style="themeList.style.body" @click="setTheme(index)">
            {{ themeList.name }}
            </el-button>
          </div>
          <div>
            <span>翻页模式</span>
          <el-button>左右</el-button>
          <el-button>滚动</el-button>
          <el-button></el-button>
          </div>
          <div>
            <span>字体</span>
          <el-button >默认</el-button>
          <el-button ></el-button>
          <el-button ></el-button>
          </div>
          <div>
            <span>字体大小</span>
            <el-button v-for="(fontSizeList,index) of this.fontSizeList" :key="index">
            {{ fontSizeList.fontSize }}
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
    <div class="read-wrapper" :style="themeList[selectTheme].style.body">
      <div id="bookRender"></div>
        <div class="info-bar">
          <div class="info">
            <i class="el-icon-s-unfold" @click="showNavDrawer()"></i>
            <span class="time">{{ nowTime }}</span>
            <span class="chapter">{{ nowChapterName }}</span>
            <span class="chapter-progress">{{ chapterPages }} / {{chapterTotalPages }}</span>
            <span class="progress">
            <el-progress
            :percentage="countProgressPercentage" 
            :format="formatProgress"></el-progress>
            </span>
          </div>
          <div class="activity-button">
            <button class="left" @click="prevPage()">上一页</button>
            <span class="center"></span>
            <button class="right" @click="nextPage()">下一页</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Epub from 'epubjs'
import {getNowTime} from '@/utils/utils'

export default {
  data(){
    return{
        navItemsName:'chapter',
        book:'',
        rendition:'',
        nowTime:'',
        bookInfo:{},
        countProgressPercentage:0,
        totalPages:0,
        nowPages:0,
        chapterPages:0,
        chapterTotalPages:0,
        chapterList:[],
        nowChapterName:'',
        fontSize: 16,
        navigation:null,
        cover:'',
        fontSizeList:[
          {
            fontSize:12
          },
          {
            fontSize:14
          },
          {
            fontSize:16
          },
          {
            fontSize:18
          },
          {
            fontSize:20
          },
          {
            fontSize:22
          },
          {
            fontSize:24
          }
        ],
        selectTheme:0,
        themeList:[
          {
            name:'day',
            style:{
              body:{
                'color':'#000',
                'background':'#fff'
              }
            }
          },
          {
            name:'night',
            style:{
              body:{
                'color':'#E0E0E0',
                'background':'#081c3b'
              }
            }
          },
          {
            name:'dark',
            style:{
              body:{
                'color':'#fff',
                'background':'#000'
              }
            }
          }
        ],
        timer:null,
        locations:null,
        drawer:false,
        bookAvailable:false
    }
  },
  mounted(){
    this.nowTime = getNowTime()
    this.showEpub()
  },
  created(){
    this.timer&&clearInterval(this.timer)
    this.initTimer()
  },
  methods:{
    // async getBook(){
    //     await axios.get('').then(res=>{
    //         console.log(res)
    //     })
    // },
    //打开侧边栏
    showNavDrawer(){
      this.drawer = true
    },
    jumpTo(href){
      this.rendition.display(href)
      this.showProgress()
      this.drawer = false
    },
    showEpub(){
      // TO-DO: 从后端加载epub
      this.book = new Epub('http://127.0.0.1:9000/files/ebook/02_01.epub')
      this.rendition = this.book.renderTo('bookRender',{
        width:window.innerWidth,
        height:window.innerHeight-50
      })
      this.themes = this.rendition.themes
      this.registerTheme()
      this.setTheme(this.selectTheme)
      //this.setFontSize(this.fontSize)
      this.rendition.display()
      //获取基本信息
      this.book.loaded.metadata.then(meta => {
        this.bookInfo = meta
	    });
      //获取小说封面
      this.book.loaded.cover.then(async cover=>{
        await this.book.archive.createUrl(cover).then(url=>{
          this.cover = url
        })
      })
      // 获取locations对象 epubjs的钩子函数实现
      this.book.ready.then(()=>{
        console.log(this.book)
        this.navigation = this.book.navigation
        this.chapterList = this.navigation.toc
        return this.book.locations.generate()
      }).then(result=>{
        //console.log(result);
        this.locations = this.book.locations
        this.totalPages = this.locations.total
        this.bookAvailable = true
        if(this.rendition){
          this.showProgress()
        }
      })
    },
    setTheme(index) {
    this.themes.select(this.themeList[index].name)
    this.selectTheme = index
    this.drawer = false
    },
    registerTheme() {
    this.themeList.forEach(theme => {
      this.themes.register(theme.name, theme.style)
    })
    },
    showProgress(){
      // 获取当前位置信息 
      const currentLocation = this.rendition.currentLocation()
      console.log(currentLocation)
      console.log(this.locations)
      console.log(this.navigation)
      console.log(this.rendition)
      // this.setNowChapter()
      this.chapterPages = `${currentLocation.start.displayed.page}~${currentLocation.end.displayed.page}`
      this.chapterTotalPages = currentLocation.end.displayed.total
      // 获取当前位置进度百分比
      const nowProgress = this.bookAvailable ? currentLocation.end.percentage : 0
      // 转化成0-100的数字
      this.nowPages = this.bookAvailable ? this.locations.locationFromCfi(currentLocation.end.cfi) : 0
      this.countProgressPercentage = Math.round(nowProgress*100)
    },
    prevPage(){
      if(this.rendition){
        this.rendition.prev()  
        this.showProgress()
      }
    },
    nextPage(){
      if(this.rendition){
        this.rendition.next()
        this.showProgress()
      }
    },
    setNowChapter(index){
      this.nowChapterName = this.navigation.toc[index].label
    },
    setFontSize(fontSize) {
    this.defaultFontSize = fontSize
    if (this.themes) {
      this.themes.fontSize(fontSize + 'px')
    }
    },
    initTimer(){
      this.nowTime = this.setTimer()
    },
    formatProgress(percentage){
      return `${percentage}% ${this.nowPages}/${this.totalPages} ${this.bookInfo.title}`
    },
    setTimer(){
      this.timer&&clearInterval(this.timer)
        if(this.timer == null){
          this.timer = setInterval(()=>{
            this.nowTime = getNowTime()
          },1000)
        }
      },
  },
}
</script>

<style lang="less" scoped>
#app{
  .read-wrapper{
      .info-bar{
        height: 40px;
        display: flex;
        position: fixed;
        bottom: 0;
        .info{
          display: flex;
          .time{
            min-width: 76px;
          }
          .progress{
            width: 460px;
          }
        }
      }
    }
}

</style>