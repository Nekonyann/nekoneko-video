<template>
    <div id="app">
        <div class="header">
           <a>Neko!Neko!</a>
        </div>
        <div class="main">
            <div class="login-box">
                <h3>登录</h3>
                <el-form ref="form" :model="form" :rules="fromRules" label-width="80px">
                    <el-form-item label="账号" prop="username">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" show-password></el-input>
                    </el-form-item>
                        <button @click="onSub()" class="login-button" :loading="isLoading">登录</button>
                </el-form>
            </div>
            
        </div>
        <footer class="footer">
            <span>© 2022 Copyright NEKOnyako</span>
        </footer>
    </div>
</template>

<script>
import {Login} from '@/api/User'
import {throttle} from '../../utils/utils.js'
export default{
    data() {
        return {
            form:{
            username:null,
            password:null
            },
            isLoading: false,
            fromRules:{
                username: [
                    { required: true, message: '*请输入账号', trigger: ['blur','change'] },
                    { min: 3, message: '格式错误', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '*请输入密码', trigger: ['blur','change'] },
                    { min: 4, message: '格式错误', trigger: 'blur' }
                ],
            },
        }
    },
    mounted(){
        if(localStorage.getItem("token")||this.$store.state.isLogin){
            this.$router.push("/home")
        }
    },
    methods:{
        onSubmit(){
            this.$refs.form.validate(async (valid) => {
                this.isLoading = true
                if (!valid) {return this.isLoading = false};
                await Login(this.form).then((res)=>{
                    if(res.data.code===20011){
                        if(res.data.data.enable===1){
                        this.$message.success("登录成功")
                        localStorage.setItem('token',JSON.stringify(res.data.data))
                        this.$router.push({path:"/home",params:{noCache:true}})
                        }else{
                        this.$message.error("您没有权限")
                        this.isLoading = false
                        }
                    }else{
                    this.$message.error("账号或密码错误")
                    this.isLoading = false
                    }
                })
            })
        },
        /**
         * 提交节流
         */
        onSub:throttle(function(form){
            this.onSubmit(form)
        },4000),
        watch: {
		// 路由push相同地址不同参数时 不会自动刷新页面，这里通过watch监听路由变化，一但发生变化reload刷新
		$route(to, from) {
			if (to !== from) {
				this.reload();
			}
		},
	},
    }
}
</script>

<style lang="less" scoped>
    #app{
        height: 100%;
        .header{
            height: 60px;
            background-color: #fff;
            display: flex;
            align-items: center;
            padding: 0 10px;
        }
        .main{
            height: 500px;
            background: url(@/assets/images/login.png) no-repeat center;
            background-size: cover;
            display: flex;
            justify-content: flex-end;
            .login-box{
                position: relative;
                z-index: 1;
                width: 300px;
                padding-right: 100px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .el-form{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .el-input{

                }
                .login-button{
                    height: 50px;
                    width: 220px;
                    margin-top: 15%;
                    color: #fff;
                    background-color: #209fdf;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 5px;
                    margin-left: 4px;
                    font-size: 18px;
                    border-radius: 0.5rem;
                }
                .login-button:hover{
                    background-color:#2070df;
                }
            }
            .login-box:after {
                content: '';
                height:500px;
                width: 300px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255,255,255,0.8);
                z-index: -1;
                // -webkit-filter: blur(5px);
                // -moz-filter: blur(5px);
                // -ms-filter: blur(5px);
                // -o-filter: blur(5px);
                // filter: blur(5px);
            }
        }
        .footer {
            height: 5vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            color: #999;
        }
    }
</style>