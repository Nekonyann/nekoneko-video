<template>
    <div id="app">
        <el-container>
            <el-header><span>Neko!Neko!创作中心</span> <a href="/nekovideo">主站</a></el-header>
            <el-container class="main">
                <el-aside><Aside></Aside></el-aside>
                <el-main><router-view/></el-main>
            </el-container>
        </el-container>
        <!-- <PlatformMain></PlatformMain> -->
    </div>
</template>

<script>
// import PlatformMain from '@/components/platform/Main.vue'
import Aside from '@/components/platform/Aside.vue'
export default {
    components: {
    Aside,
  }
}
</script>

<style scoped lang="less">
    .el-container,html,body{
    height: 100%;
  }
  .el-header{
    display: flex;
    align-items: center;
  }
  .main{
    height: calc(100% - 60px);
  }
  /**
  .main{
    background: url(@/assets/images/upload_bg.jpg) fixed top center no-repeat;
    background-size: cover;
}
   */
</style>
