<template>
    <div id="app">
        <span class="title">404 Not Found</span>
        <h3>页面未找到,<span>{{ countDown }}s后自动跳转到<a href="/">首页</a></span></h3>
    </div>
</template>

<script>
export default{
    data(){
        return{
            countDown:5,
            timer:null
        }
    },
    created(){
        this.timer&&clearInterval(this.timer)
        this.timer = setInterval(()=>{
            this.countDown >0 ?this.countDown --: this.goHome()
        },1000)
    },
    methods:{
        goHome(){
            this.$router.push('/home')
            this.timer&&clearInterval(this.timer)
        }
    }
}
</script>

<style lang="less" scoped>
#app{
    text-align: center;
    .title{
        display: inline-block;
        margin:20px 0 ;
        font-size: 60px;
        font-weight: 800;
    }
}
</style>