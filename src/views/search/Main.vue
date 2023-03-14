<template>
    <div id="app">
        <Header></Header>
        <Main></Main>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Main from '@/components/searchpages/ResultVideo.vue';
export default{
    name:'search',
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