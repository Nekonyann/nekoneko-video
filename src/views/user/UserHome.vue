<template>
    <div id="app">
        <Header></Header>
        <Main></Main>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Main from '@/components/userhome/Main.vue';
export default{
    name:'user',
    components: {
        Header,
        Main
    },
    data(){
        return{
            
        }
    }
}
</script>

<style lang="less" scoped>

</style>