<!-- 导航栏 -->
<template>
    <div class="nav">
        <div class="header-icon">
            <a href="/"><svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512"><path fill="#fff" d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/></svg><span class="name">Neko!Neko!</span></a>
        </div>
        <div class="nav-search-box">
            <form class="nav-search-form">
                <el-input v-model="search" placeholder="搜索..."></el-input>
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
                <router-link target="_blank" to="/videoupload">
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
            search: ''
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
            if(this.search.length!=0){
                this.$router.push({path:'/search/video',query:{keywords:this.search}})
            }else{
                this.$message.warning("你似乎没有输入内容呢")
            }
        }
    }
}
</script>

<style lang="less" scoped>
@width-mobile:550px;
@width-medium:768px;
@width-large:1024px;

.nav {
    background-color: #2CA2EC;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-icon {
        display: flex;
        align-items: center;
        margin-left: 10px;
        >a{
            display: inline-flex;
            align-items: center;
            .icon{
            color: #fff;
            width: 30px;
            margin-right: 5px;
            transform:rotate(30);
        }
        }
        
    }

    .name {
        color: #fff;
    }

    .nav-search-box {
        border-radius: 8px;
        min-width: 181px;
        max-width: 500px;
        height: 40px;
        background: #F5F6F7;
        .nav-search-form{
            display: flex;
            align-items: center;
            border-radius:8px;
            /deep/ .el-input__inner {
                width: 100%;
                border: none;
                border-radius: 8px;
                background-color: #F5F6F7;
            }
            /deep/ .el-input__inner:focus{
                background-color: #fff;
            }
            .el-button{
                border-radius: 8px;
                background-color: #F5F6F7;
                border: none;
            }
        }
       

    }

    .user-con{
        display: flex;
        margin-right: 5px;
        align-items: center;    
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
    transition: background-color .3s;
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

@media screen and (max-width:@width-mobile) {
    .nav{
        max-width: @width-mobile;
        .name{
            display: none;
        }
    }
    .user-con{
        .upload-button{
            display: none;
        }
    }

    .nav-search-box{
        border-radius: 20px;
        width: 172px;
        .nav-search-form{
            border-radius: 20px;
           /deep/ .el-input__inner{
                height: 30px;
                border-radius: 20px;
            }
            .el-button{
                border-radius: 20px;
            }
        }
    }
    
}

@media screen and (min-width:@width-mobile)and (max-width:@width-medium) {
    
}
</style>