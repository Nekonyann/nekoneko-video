<!-- 导航栏 -->
<template>
    <div class="nav">
        <div>
            <a href="/"><span class="name">Neko!Neko!</span></a>
        </div>
        <div class="nav-search-box">
            <form>
                <el-input v-model="serch" placeholder="搜索..."></el-input>
                <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
            </form>
        </div>
        <div class="user-con">
            <div class="items">
            <el-popover placement="bottom" trigger="hover" v-if="$store.state.isLogin">
                <!-- 已登录 -->
                <span class="user" slot="reference">
                    <!-- 头像 -->
                    <el-avatar :src="userInfo.face"></el-avatar>
                    <router-link :to="{name:'userhome',params:{uid:userInfo.uid}}"><span>{{ userInfo.name }}</span></router-link>
                </span>
                
                <div>
                    <div class="popper-user">
                        <a href="javascript:;" @click="loginOut()">退出登录</a>
                    </div>
                </div>
            </el-popover>
            <!-- 未登录 -->
            <el-popover placement="bottom" trigger="hover" width="130" v-else>
                <span class="user" slot="reference">
                    <!-- 头像 -->
                    <el-avatar>登录</el-avatar>
                    <span>未登录</span>
                </span>

                <!-- 下拉框 -->
                <div class="popper-user">
                    <p>点击登录</p>
                    <router-link class="button login-button" to="/login">登录</router-link>
                </div>
            </el-popover>
            </div>
            <div class="items" v-if="$store.state.isLogin">
                <router-link to="/videoupload">
                    <button class="upload-button button">
                        上传
                    </button>
                </router-link>
            </div>

        </div>
    </div>
</template>

<script>
import {Logout} from '@/api/User'
export default {
    data() {
        return {
            flag: false,
            userInfo: {
                uid:'',
                name: '',
                face: ''
            },
            serch: ''
        }
    },  
    mounted() {
        if(this.$store.state.isLogin){
            this.userInfo.uid = this.$store.state.isLogin.uid
            this.userInfo.name = this.$store.state.isLogin.username
            this.userInfo.face = this.$store.state.isLogin.face
        }
    },
    methods: {
        // handleCommand(command) {
        //     if (command == 'loginOut') {
        //     }
        // },
        async loginOut(){
            await Logout().then(res =>{
                if(res.data.code = 20011){
                    window.localStorage.removeItem('token')
                    window.localStorage.removeItem('authorization')
                    this.$store.state.isLogin = false
                    this.$message.success(res.data.message)
                }else{
                    this.$message.error("error")
                }
            })
        },
        handleSearch(){
            if(this.serch.length!=0){
                this.$router.push({path:'/search/video',query:{keywords:this.serch}})
            }else{
                this.$message.warning("你似乎没有输入内容呢")
            }
        }
    }
}
</script>

<style lang="less" scoped>
.nav {
    background-color: #2CA2EC;
    height: 50px;
    display: flex;
    justify-content: space-between;

    >div {
        display: flex;
        align-items: center;
        margin-left: 10px;
    }

    .name {
        color: #fff;
    }

    .nav-search-box {
        .el-input {
            width: 300px;
        }
    }

    .user-con{
        display: flex;
        margin-right: 5px;
        .el-avatar {
        margin-right: 10px;
        }
        .items{
            margin-right: 5px;
            margin-left: 5px;
        }
        .user {
            display: flex;
            height: 50px;
            align-items: center;
        }
        .upload-button {
            background-color: #72d8fb;
            border-radius: 8px;
            width: 44px;
            height: 34px;
            color: #fff;
        }

        .upload-button:hover {
            background-color: #5bd6ff;
        }
    }

}

.popper-user{
    display: flex;
    align-items: center;
    flex-direction: column;
}

.button{
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    border: 0; 
    outline: none;
    transition: background-color .3s;;
}

.login-button{
    background-color: #72d8fb;
    width: 60px;
    height: 33px;
    display: flex;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
}

.login-button:hover{
    background-color: #3ac9f8;
}
</style>