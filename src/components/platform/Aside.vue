<template>
      <el-menu
      default-active="main"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#388DEA"
      :default-active="$route.path"
      router>
      <el-menu-item index="/videoupload/main">
        <i class="el-icon-document"></i>
        <span slot="title">投稿</span>
      </el-menu-item>
      <el-menu-item index="/videoupload/home">
        <i class="el-icon-document"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="/videoupload/upload-manager">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>内容管理</span>
        </template>
        <el-menu-item-group>
          <template slot="title">操作</template>
          <el-menu-item index="/videoupload/upload-manager/article">稿件管理</el-menu-item>
          <el-menu-item index="/videoupload/upload-manager/audience-subtitles">字幕管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="">
        <i class="el-icon-setting"></i>
        <span slot="title">小说管理</span>
      </el-menu-item>
      <el-submenu index="1-4">
        <template slot="title">互动管理</template>
        <el-menu-item index="1-4-1" disabled>评论管理</el-menu-item>
        <el-menu-item index="1-4-1" disabled>弹幕管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="/videoupload/extract-subtitles">
        <i class="el-icon-setting"></i>
        <span slot="title">字幕提取器(beta)</span>
      </el-menu-item>
    </el-menu>
</template>

<script>
//   import {getMenuList} from '../api/home'
export default {
  data(){
    return{
      menuList: []
    }
  },
  methods: {
    // 获取菜单项
    // async getMenuList(){
    //   await getMenuList().then((res)=>{

    //   })
    // }
  },
  created(){
    // this.getMenuList()
  }
}
</script>

<style lang="less" scoped>
  .el-menu{
    height: 100%;
  }
</style>

