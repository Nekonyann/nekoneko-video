<template>
    <div id="app">
      <el-container>
        <el-header><Header></Header></el-header>
        <el-main><Main></Main></el-main>
        <el-footer><div>© 2022~2023 Copyright NEKOnyako</div></el-footer>
      </el-container>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Main from '@/components/home/Main.vue';
// import Footer from '@/components/Footer.vue';
export default {
    components: {
        Header,
        Main
    },
    
    data() {
        return {

        };
    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
#app{
  height: auto;
}
.el-header{
    padding: 0;
    height: 50px !important;
  }
  .el-main{
    height: 100%;
  }
  .el-container{
    height: 100%;
  }
  .el-footer{
    background-color: rgba(237,241,242,.8);
    display: flex;
    height: 50px !important;
    font-size: 14px;
    padding: 10px;
    align-items: center;
    color: #58666e;
    width: 100%;
    position: relative;
    bottom: 0;
  }
</style>