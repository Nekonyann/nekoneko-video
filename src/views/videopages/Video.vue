<template>
 <div id="app">
    <el-container>
        <el-main>
          <n-header></n-header>
          <n-main></n-main>
        </el-main>
    </el-container>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Main from '@/components/videopage/Main.vue';
export default {
    components: {
        'n-header':Header,
        'n-main':Main
    },
    data() {
        return {
            
        }
    },
    methods:{

    }
}
</script>

<style lang="less" scoped>
.el-header{
    padding: 0;
    height: 50px !important;
    top: 0 !important;
  }
  .el-container{
    height: 100%;
  }
  .el-main{
    padding: 0;
  }
</style>