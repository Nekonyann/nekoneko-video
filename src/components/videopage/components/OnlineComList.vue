<template>
    <div id="app">
        <div class="message_box">
            <div class="message">
                <div class="message-list" ref="message">
                    <!-- 显示消息 -->
                </div>
                <div class="send-message">
                    <textarea v-model="text" class="send-message"></textarea>
                    <el-button type="primary" size="mini" :loading="isLoading" @click="onSub">发送</el-button>
                </div>
            </div>
            <div class="online-list">
                <p>房间人数:{{ count }}</p>
                <div v-for="user in users" :key="user.username">{{user.username}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import {throttle,getNowTime,formatTime} from '@/utils/utils'
let socket

export default {
    props:['nid'],
    data() {
        return {
            count: 0,
            isLoading:false,
            user: {},
            users:[],
            newUser:'',
            delUser:'',
            text: "",
            time:'',
            isJoin:true
        }
    },
    created() {
        this.init()
        console.log(this.nid)
    },
    methods: {
        //构建进出胶囊消息
        createUserContent(type,username){
            const newMeJoinTem = `
            <span class="new-join" v-if="isJoin"><span class="mine-name">${username}</span> 加入了房间</span>`
            const newOtherJoinTem = `
            <span class="new-join"><span class="other-name">${username}</span> 加入了房间</span>`
            const newOtherQuitTem = `
            <span class="new-join"><span class="exit-name">${username}</span> 退出了房间</span>`
            if(type ==1){
                this.$refs.message.innerHTML+=newMeJoinTem
            }else if(type==2){
                this.$refs.message.innerHTML+=newOtherJoinTem
            }
            if(type==0){
                this.$refs.message.innerHTML+=newOtherQuitTem
            }
            if(type==10){
                this.$refs.message.innerHTML+=processControlTem
            }
            this.scrollToBottom()
        },
        //构建普通消息
        createContent(isMe,username,context,time){
            const deleteMessageContent = `
            <span class="face" v-if="user.src == null">
                        <el-avatar
                            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                    </span>
                    <span class="face" v-else>
                        <el-avatar :src="user.src"></el-avatar>
                    </span>
            `
            const otherContent = `
            <div class="msg">
                <div class="other-info">
                    <span class="face">
                        <el-avatar
                            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                    </span>
                    <div class="user">
                        <span class="other-name">${username}</span>
                        <span class="text">${context}</span>
                    </div>
                </div>
                <div class="time">${time}</div>
            </div>`
            const mineContent = `
            <div class="msg mine">
                <div class="mine-info">
                    <span class="face">
                        <el-avatar
                            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                    </span>
                    <div class="user mine">
                        <span class="mine-name">${username}</span>
                        <span class="text mine">${context}</span>
                    </div>
                </div>
                <div class="time">${time}</div>
            </div>`
            if(isMe){
                this.$refs.message.innerHTML+=mineContent
            }else{
                this.$refs.message.innerHTML+=otherContent
            }
            this.scrollToBottom()
        },
        createProcessControl(isMe,username,context,time){
            const processControlTem = `<span class="new-join">${time} <span class="other-name">${username}</span> ${context}</span>`
            this.$refs.message.innerHTML+=processControlTem
            this.scrollToBottom()
        },
        init() {
            this.user = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null
            let username = this.user.username;
            let _this = this;
            if (typeof (WebSocket) == "undefined") {
                this.$message({ type: 'error', message: "您的浏览器不支持聊天室,将禁用" })
                this.type=false
            } else {
                let socketUrl = `ws://localhost:9000/wbserver/${this.nid}/${username}`
                // if (socket == null) {
                //     this.$message({ type: 'error', message: '房间连接错误' })
                //     return
                // }
                if (socket != null) {
                    socket.close();
                    socket = null;
                }
                socket = new WebSocket(socketUrl);
                socket.onopen = function () {
                    _this.$message({ type: 'success', message: '成功加入房间' })
                    this.isJoin=true
                };
                socket.onmessage = (msg) =>{
                    let data = JSON.parse(msg.data)
                    console.log(`收到消息${msg.data}`)
                    _this.type = data.type
                    if(this.type == 'isSystem'){
                        _this.count = data.count
                        _this.users = data.users
                        if(data.newUser!=null){
                            _this.newUser = data.newUser
                            if(_this.newUser==username){
                                _this.createUserContent(1,this.newUser)
                            }else{
                                _this.createUserContent(2,this.newUser)
                            }
                        }
                        if(data.delUser!=null){
                            _this.delUser = data.delUser
                            _this.createUserContent(0,this.delUser)
                        }
                    }else if(this.type == 'proTime'){
                        let from = data.from
                        let message = `进度条拖至:${formatTime(data.message)}`
                        let time = data.time
                        let proTime = data.message
                        this.$emit('proTime',proTime)
                        _this.createProcessControl(true,from,message,time)
                    }else{
                        let from = data.from
                        let message = data.message
                        let time = data.time
                        if(username==from){
                            _this.createContent(true,from,message,time)
                        }else{
                            _this.createContent(false,from,message,time)
                        }
                    }
                    
                };
                socket.onclose = function () {
                    _this.$message({ type: 'info', message: '退出一起看房间' })
                    _this.$router.push({path:`/video/${this.nid}`})
                };
            }
        },
        //发送文字消息
        send() {
            if (!this.text) {
                this.$message({ type: 'warning', message: '请输入内容' })
                return;
            }
            this.isLoading=true
            let content = this.text
            // let content = { // 封装消息体
            //     type:"txt",
            //     msg:this.text
            // };
            this.text = null
            let message = {
                from: this.user.username,
                message: content,
                type:'txt',
                nid: this.nid,
                time:getNowTime()
            }
            socket.send(JSON.stringify(message));  // 将组装好的json发送给服务端，由服务端进行转发
            this.isLoading=false
        },
        //发送视频进度条时间
        sendProcessTime(proTime){
            if (proTime =="") return
            let message ={
                from: this.user.username,
                message: `${proTime}`,
                type:'proTime',
                nid: this.nid,
                time:getNowTime()
            }
            socket.send(JSON.stringify(message));
        },
        //获取历史消息
        getHistory(){

        },
        //自动滑动到底部
        scrollToBottom(){
            this.$nextTick(()=>{
            let chatform = this.$refs.message;
            chatform.scrollTop = chatform.scrollHeight;
            });
        },
        onSub:throttle(function(){
            this.send()
        },4000),
    }
}
</script>

<style lang="less">
#app {
    margin-bottom: 20px;
}

.message_box {
    display: flex;
    height: 460px;

    .message{
        display: flex;
        flex-direction: column;
        width: 70%;
    }
    .message-list {
        height: 440px;
        background-color: #2D333B;
        color: #fff;
        display: flex;
        flex-direction: column;
        word-break: break-all;
        word-wrap: break-word;
        overflow:auto;
        .new-join {
            align-self: center;
            border-radius: 5px;
            margin: 5px 0;
            padding: 0 10px;
            background-color: #6f6f6f;
        }

        .msg {
            display: flex;
            justify-content: space-between;
            margin: 5px 10px;
            flex-wrap: wrap;
            justify-content: space-between;

            .other-info {
                display: flex;
            }

            .user {
                display: flex;
                flex-direction: column;
            }

            .time {
                align-items: center;
                font-size: 14px;
                color: #999;
                width: 60px;
            }
        }

        .mine {
            flex-direction: row-reverse;

            .mine-info {
                display: flex;
                flex-direction: row-reverse;
            }
        }

        .other-name {
            color: #20df26;
            font-size: 14px;
        }
        .mine-name {
            color: #c9df20;
            font-size: 14px;
        }
        .exit-name{
            color: #f83939;
            font-size: 14px;
        }
    }

    .online-list {
        width: 30%;
        background-color: #808080;
        >p{
            
            text-align: center;
            border-bottom:1px solid #2D333B;
        }
    }

}

.send-message {
    display: flex;
    width: 100%;
}
</style>