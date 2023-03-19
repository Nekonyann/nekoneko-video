<template>
    <div id="app">
        <div class="header">
           <a href="/">Neko!Neko!</a>
        </div>
        <div class="main">
            <div class="login-box">
                <h3>忘记密码</h3>
                <el-form ref="form" :model="form" :rules="fromRules" label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" show-password></el-input>
                    </el-form-item>
                </el-form>
                <button @click="onSub()" class="login-button" :loading="isLoading">注册</button>
            </div>
            
        </div>
        <footer class="footer">
            <span>© 2022 Copyright NEKOnyako</span>
        </footer>
    </div>
</template>

<script>
export default {
    data(){
        return {
            username:'',
            password:''
        }
    }
}
</script>

<style lang="less" scoped>

</style>