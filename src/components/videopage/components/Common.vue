<template>
    <div class="comment">
        <div class="b-head">
            <span class="b-head-t">{{ commentCount }}</span>
            <span class="b-head-t">评论</span>
        </div>
        <div class="comment-send">
            <textarea cols="80" name="msg" rows="5" placeholder="发一条友善的评论叭~" class="ipt-txt" v-model="Comment.content"></textarea>
            <button type="submit" class="comment-submit" @click="insertComment()">发表评论</button>
        </div>
        <div class="comment-list">
            <div v-for="(comment, index) of commentList" :key="index" class="comment-card">
                <div>
                    <el-avatar :src="comment.owner.face"></el-avatar>
                </div>
                <div class="main">
                    <p class="username">{{ comment.owner.username }} <span v-if="upid===comment.owner.uid"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="11.5" rx="2" fill="#FF6699"></rect><path d="M5.7 8.36V12.79C5.7 13.72 5.96 14.43 6.49 14.93C6.99 15.4 7.72 15.64 8.67 15.64C9.61 15.64 10.34 15.4 10.86 14.92C11.38 14.43 11.64 13.72 11.64 12.79V8.36H10.47V12.81C10.47 13.43 10.32 13.88 10.04 14.18C9.75 14.47 9.29 14.62 8.67 14.62C8.04 14.62 7.58 14.47 7.3 14.18C7.01 13.88 6.87 13.43 6.87 12.81V8.36H5.7ZM13.0438 8.36V15.5H14.2138V12.76H15.9838C17.7238 12.76 18.5938 12.02 18.5938 10.55C18.5938 9.09 17.7238 8.36 16.0038 8.36H13.0438ZM14.2138 9.36H15.9138C16.4238 9.36 16.8038 9.45 17.0438 9.64C17.2838 9.82 17.4138 10.12 17.4138 10.55C17.4138 10.98 17.2938 11.29 17.0538 11.48C16.8138 11.66 16.4338 11.76 15.9138 11.76H14.2138V9.36Z" fill="white"></path></svg></span></p>
                    <p class="text">{{ comment.content }}</p>
                    <p class="info">
                        <span class="time">{{ comment.createTime }}</span>
                        <span>点赞数:{{ comment.praiseCount }}</span>
                        <span>点踩数:0</span>
                        <a @click="recallCommentBox(index)"
                        class="item">回复</a>
                        <a v-if="$store.state.isLogin.uid===comment.owner.uid" 
                        @click="checkDelete(comment.commentId)"
                        class="item">删除</a>
                    </p>
                    <div v-if="comment.commentReplyList.length!=0" class="reply-box">
                        <div v-for="(commentReply, index) of comment.commentReplyList" :key="index" v-show="index<maxDisplay || showAll" class="reply-items">
                            <el-avatar :src="comment.owner.face"></el-avatar>
                            <p class="reply-username">{{ commentReply.owner.username }} <span v-if="upid===comment.owner.uid">[up]</span></p>
                            <!-- <p v-if="commentReply.owner">1</p> -->
                            <p>{{ commentReply.content }}</p>
                            <!-- <a @click="recallCommentBox(index)"
                                class="item">回复</a> -->
                                <a v-if="$store.state.isLogin.uid===commentReply.owner.uid" 
                                @click="checkDeleteCommentRe(commentReply.rid)"
                                class="item">删除</a>
                            <span class="time">{{ commentReply.createTime }}</span>
                        </div>
                        <div class="more-reply" v-if="comment.commentReplyList.length>maxDisplay && !showAll">
                            剩余 {{ comment.commentReplyList.length-maxDisplay }} 条评论 <a @click="showAllCommentReply(index)" class="show">点击展开</a>
                        </div>
                        <div class="more-reply" v-else><a @click="showAllCommentReply(index)">收起</a></div>
                    </div>
                    <!-- 子评论评论框 -->
                    <div class="reply-box reply-comment" v-if="showBackCommentBox===index">
                        <textarea cols="80" name="msg" rows="5" v-model="CommentReply.content" :placeholder="`回复 @${comment.owner.username} :`" class="ipt-txt"></textarea>
                        <button type="submit" class="comment-submit" @click="replyCommentMain(comment.commentId,comment.owner.uid)">回复</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部评论框 -->
        <!-- <div class="fixed-comment-box">
            <div class="comment-box">
                <textarea cols="80" name="msg" rows="2" placeholder="发一条友善的评论叭~" class="ipt-txt" v-model="Comment.content"></textarea>
                <button type="submit" class="comment-submit" @click="insertComment()">发表评论</button>
            </div>
        </div> -->
        <div class="no-data" v-if="commentList.length===0">貌似还没有评论呢!</div>
    </div>
</template>

<script>
import {selectCommentByNid,sendComment,sendCommentReply,deleteComment,deleteCommentReply} from '@/api/Video'
import {getNowDateTime} from '@/utils/utils'
export default {
    props:['commentCount','nid','upid'],
    data() {
        return {
            commentList:[],
            Comment:{
                nid:-1,
                uid:-1,
                content:'',
                createTime:''
            },
            CommentReply:{
                uid:-1,
                commentId:-1,
                replyUid:-1,
                content:'',
                createTime:''
            },
            showBackCommentBox:-1,
            showAll:false,
            showAllReply:[],
            maxDisplay:3
        }
    },
    mounted(){
        this.getComments(this.nid)
    },
    computed:{
        computedGetComments(){
            return this.commentList.map(comments => ({
            ...comments,
            showChildren: false
        }))
        }
    },
    methods:{
        async getComments(nid){
            console.log(nid)
            await selectCommentByNid(nid).then(res =>{
                this.commentList = res.data.data
                console.log(this.commentList)
            })
        },
        async insertComment(){
            if(this.Comment.content.length<=0||this.Comment.content==''){
                this.$message.warning("似乎还没有评论呢~")
                return
            }
            if(!this.$store.state.isLogin){
                this.$message.warning("登录后即可评论")
                return
            }
            this.Comment.createTime = getNowDateTime()
            this.Comment.nid = this.nid
            await sendComment(this.Comment).then(res =>{
                if(res.data.code===20011){
                    this.Comment.content=''
                    this.$message.success(res.data.message)
                    this.getComments(this.nid)
                }
                
            })
        },
        recallCommentBox(index){
            if(index==this.showBackCommentBox){
                this.showBackCommentBox=-1
            }else {
                this.showBackCommentBox=index
            }
        },
        showAllCommentReply(index){
            this.showAll = !this.showAll
            // this.$set(this.showAll[index],index,!this.showAll[index])
        },
        async replyCommentMain(cid,reply_uid){
            if(!this.$store.state.isLogin){
                this.$message.warning("登录后即可评论")
                return
            }
            if(this.CommentReply.content.length<=0||this.CommentReply.content==''){
                this.$message.warning("似乎还没有评论呢~")
                return
            }
            this.CommentReply.commentId = cid
            this.CommentReply.replyUid = reply_uid
            this.CommentReply.uid = this.$store.state.isLogin.uid
            this.CommentReply.createTime = getNowDateTime()
            await sendCommentReply(this.CommentReply).then(res=>{
                if(res.data.code === 20011){
                    this.CommentReply.content=''
                    this.showBackCommentBox=-1
                    this.$message.success(res.data.message)
                    this.getComments(this.nid)
                }
            })
        },
        checkDelete(cid){
            this.$confirm('此操作将永久删除该评论以及子评论, 是否继续?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.deleteCommentMain(cid)
            }).catch(() => {
                this.$message.info('已取消删除')
                console.log(cid)
            });
        },
        checkDeleteCommentRe(rid){
            this.$confirm('此操作将永久删除该评论, 是否继续?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.deleteCommentRe(rid)
            }).catch(() => {
                this.$message.info('已取消删除')
                console.log(rid)
            });
        },
        async deleteCommentMain(cid){
            await deleteComment(cid).then(res=>{
                if(res.data.code==20011){
                this.getComments(this.nid)
                this.$message.success(res.data.message)
                }else{
                    this.$message.error(res.data.message)
                }
            })
        },
        async deleteCommentRe(rid){
            await deleteCommentReply(rid).then(res=>{
                if(res.data.code==20011){
                this.getComments(this.nid)
                this.$message.success('删除成功')
                }
            })
        }
         
        
    }
}
</script>

<style scoped lang="less">
.comment {
    .no-data{
        color:#999;
        text-align: center;
        margin: 50px 0;
    }
    .b-head {
        font-size: 18px;
        line-height: 24px;
        color: #222;
        margin: 0 0 20px 0;
        
        .b-head-t{
            margin-right: 10px;
        }
    }

    .comment-send {
        display: flex;
        height: 100px;
    }

    .comment-list {
        border-top: 1px solid #999;
        .comment-card{
            display: flex;
            margin-top: 20px;
            border-bottom: 1px solid rgb(184, 184, 184);
            padding-bottom: 20px;
            .main{
                .username{
                    font-weight: 600;
                    font-size: 14px;
                    display: flex;
                }
                .text{
                    font-size: 15px;
                    line-height: 24px;
                    padding: 2px 0;
                }
                .info{
                    color: #999;
                    font-size: 14px;
                    >span{
                        margin-right: 10px;
                    }
                    .item{
                        color: #999;
                        cursor:pointer;
                        margin-right: 10px;
                        transition: all ease .3s;
                    }
                    .item:hover{
                        color: #00a1d6;
                    }
                }
                .reply-box{
                    .reply-items{
                        display: flex;
                        font-size: 14px;
                        .reply-username{
                            font-weight: 600;
                            font-size: 13px;
                        }
                        .time{
                            color: #999;
                            font-size: 13px;
                        }
                    }
                    
                }
            }
        }
    }
    .fixed-comment-box{
        position: fixed;
        height: 40px;
        bottom: 0;
        z-index: 10;
        padding: 15px 0;
        background-color: #f4f5f7;
        .comment-box{
            display: flex;

        }
    }
    .more-reply{
        font-size: 14px;
        font-size: 500;
        margin-top: 5px;
    }
    .show{
        color: #9499a0;
        cursor:pointer;
        margin-right: 10px;
        transition: all ease .3s;
    }
    .show:hover{
        color: #00a1d6;
    }
    .reply-comment{
        display: flex;
    }
    .ipt-txt {
        font-size: 12px;
        display: inline-block;
        box-sizing: border-box;
        background-color: #f4f5f7;
        border: 1px solid #e5e9ef;
        overflow: auto;
        border-radius: 4px;
        color: #555;
        width: 100%;
        height: 65px;
        transition: 0s;
        padding: 5px 10px;
        line-height: normal;
        outline: none;
        margin-right: 10px;
        }

        .comment-submit {
            width: 70px;
            height: 64px;
            top: 0;
            padding: 4px 15px;
            font-size: 14px;
            color: #fff;
            border-radius: 4px;
            text-align: center;
            min-width: 60px;
            vertical-align: top;
            cursor: pointer;
            background-color: #2CA2EC;
            border: 1px solid #2CA2EC;
            transition: 0.1s;
            user-select: none;
            outline: none;
        }

        .ipt-txt:hover,.ipt-txt:focus {
            border-color: #00b5e5;
        }

        .comment-submit:hover {
            background-color: #00b5e5;

        }
}
</style>