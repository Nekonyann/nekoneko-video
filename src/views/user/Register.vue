<template>
    <div id="app">
        <div class="header">
           <a href="/">Neko!Neko!</a>
        </div>
        <div class="main">
            <div class="login-box">
                <h3>注册</h3>
                <el-form ref="formData" :model="formData" :rules="fromRules" label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="formData.username" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="formData.password" autocomplete="off" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="再次输入密码" prop="repassword">
                        <el-input v-model="formData.repassword" autocomplete="off" show-password></el-input>
                    </el-form-item>
                </el-form>
                <button @click="onSub('formData')" class="login-button" :loading="isLoading">注册</button>
            </div>
            
        </div>
        <footer class="footer">
            <span>© 2022 Copyright NEKOnyako</span>
        </footer>
    </div>
</template>

<script>
import { Register } from '@/api/User';
import {throttle} from '../../utils/utils.js'
export default {
    data(){
        let checkPassword = (rule, value, callback) =>{
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formData.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        }
        return {
            formData:{
                username:'',
                password:'',
                repassword:''
            },
            isLoading:false,
            fromRules:{
                username: [
                    { required: true, message: '*请输入账号', trigger: ['blur','change'] },
                    { min: 3, message: '用户名过短', trigger: 'blur' },
                    { max: 15, message: '用户名过长', trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '*请输入密码', trigger: ['blur','change'] },
                    { min: 4, message: '密码过短', trigger: 'blur' }
                ],
                repassword: [
                    { required: true , validator: checkPassword , trigger: 'blur'},
                ],
            },
        }
    },
    methods:{
        onSubmit(formData){
            this.$refs[formData].validate(async (valid) => {
            if (valid) {
                //检查用户名是否被占用
                await Register(this.formData).then(res=>{
                    if(res.data.code === 20011){
                        this.$message.success(res.data.message)
                        this.$router.push('/login')
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
            } else {
                return false;
            }
        });
        },
        onSub:throttle(function(form){
            this.onSubmit(form)
        },4000),
    }
}
</script>

<style lang="less" scoped>

</style>