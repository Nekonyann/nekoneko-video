<!-- 上传页面 -->
<template>
    <div id="app">
        <div class="upload-box" @click="checkFile()" ref="uploadFileBox">
             <p class="info">点击区域选择上传文件</p>
            <div class="none"><input type="file" ref="file" @change="inpChange" accept=".mp4,.flv,.mkv,.avi,.m4v"/></div>
        </div>
        <div class="file-list-preview">
            <div class="file-list-title">文件列表:(当前只支持单文件上传)</div>
            <li v-for="(item,index) in fileList" :key="index">
                <span>文件{{ index+1 }}:{{ item.name }}</span><button class="li-button" @click="deletFilePre(index)">删除</button>
            </li>
        </div>
        <div>
            <el-button :disabled="!(fileList.length === 1 && this.data.md5 !== null&&checkSuccess)" class="upload-button" @click="handleUpload()">上传</el-button>
        </div>
    </div>
</template>

<script>
import {setUploadData,md5} from '@/utils/fileCheck';
    export default{
        data(){
            return{
                fileList:[],
                data:{md5:null},
                checkSuccess:false
            }
        },
        mounted(){
            if(!this.$store.state.isLogin){
                this.$message.error("请登录")
                this.$router.push("/")
            }
            console.log(this.$refs.uploadFileBox)
        
        },
        methods:{
            //手动选择文件
            checkFile(){
                this.$refs.file.click()
            },
            //删除选择的文件
            deletFilePre(index){
                this.fileList.splice(index,1)
            },
            async inpChange(e){
                this.fileList.unshift(...e.target.files)
                this.$message.info("校验中")
                console.log(this.fileList)
                this.data.md5 = await md5(this.fileList[0])
                this.checkSuccess = true
            },
            //跳转上传前校验文件
            beforeUpload(){
                let _fileList = this.fileList
                let videolist = ["mp4","flv","mkv","avi","m4v"]
                let data = {}
                _fileList.forEach(item =>{
                    let file = item
                    // 文件名
                    let videoname = file.name
                    // 文件后缀
                    let fileType = videoname.replace(/.+\./,"")
                    //文件大小
                    let fileSize = file.size
                    // // if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(fileType))
                    let result = videolist.some(item =>{
                        return item == fileType
                    })
                    if (result==false) {
                        this.$message.error('您上传的似乎不是受支持的文件呢~')
                        // 重置视频列表
                        return
                    }
                    // 限制上传文件的大小
                    const isLt = fileSize / 1024 / 1024 / 1024 < 2
                    if (!isLt) {
                        this.$message.error('呐呐,文件大小不得大于2GB!')
                        return
                    }
                    if(this.data.md5==null){
                        md5(file)
                    }
                    data = setUploadData(file,this.data.md5,"video")
                    })
                    return data
            },
            handleUpload(){
                let filedata = this.beforeUpload()
                if(Object.values(filedata).length){
                    this.$router.push({name:'uploadpage',params:filedata})
                }
            },
        },
    }
</script>

<style lang="less" scoped>
#app{
    max-width: 830px;
    margin: 0 auto;
}
    .upload-box{
        height: 284px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border: 2px dashed #66ccff;
        border-radius: 8px;
        color: #999;
        font-size: 14px;
        text-align: center;
        max-width: 830px;
        .info{
            font-size: 20px;
        }
    }
    .upload-box:hover{
        border: 2px dashed #388DEA;
    }

    .none{
        height: 0px; 
        display: none;
        border: 0;
    }
    .file-list-preview{
        margin:10px 0;
        .file-list-title{
            height: 40px;
            border-radius: .5rem;
            display: flex;
            align-items: center;
            padding: 0 15px;
            background: #66ccff;
        }
        li{
            list-style:none;
        }
        .li-button{
            border-radius: .333333rem;
            background-color: #ff6666;
        }
    }
    .upload-button{
        background-color: #66ccff;
        width: 86px;
        height: 40px;
        border-radius: .5rem;
    }
    .upload-button:disabled{
        background-color: #ff6666;
    }
    .upload-button:hover{
        color: #fff;
        background-color:#388DEA;
    }
</style>