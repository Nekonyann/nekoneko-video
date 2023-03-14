<!-- 上传页面 -->
<template>
    <div id="app">
        <div class="upload-box" @click="checkFile()" ref="uploadFileBox">
            <!-- <el-upload
                class="upload-box"
                drag
                action="localhost"
                multiple
                :show-file-list=false
                ref="uploadFileBox">
                <i class="el-icon-upload"></i>
                
            </el-upload>
             -->
             <p class="info">点击区域选择上传文件</p>
            <div class="none"><input type="file" ref="file" @change="inpChange" accept=".mp4,.flv,.mkv,.avi,.m4v"/></div>
        </div>
        <div class="file-list-preview">
            <li v-for="(item,index) in fileList" :key="index">
                <span>文件名:{{ item.name }}</span><span @click="deletFilePre(index)">删除</span>
            </li>
        </div>
        <div>
            <button v-if="fileList.length ==1&&this.data.md5!=null" @click="handleUpload()">上传</button>
        </div>
    </div>
</template>

<script>
import {setUploadData,md5} from '@/utils/fileCheck';
    export default{
        data(){
            return{
                fileList:[],
                data:{md5:null}
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
                this.data.md5 =await md5(this.fileList[0])
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
                    const isLt = fileSize / 1024 / 1024 / 1024 < 1
                    if (!isLt) {
                        this.$message.error('呐呐,文件大小不得大于1GB!')
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
    .upload-box{
        height: 284px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border: 2px dashed #ffdde1;
        border-radius: 8px;
        color: #999;
        font-size: 14px;
        text-align: center;
        margin: 0 20px;

        .info{
            font-size: 20px;
        }
    }
    .upload-box:hover{
        border: 2px dashed #ee9ca7;
    }

    .none{
        height: 0px; 
        display: none;
        border: 0;
    }
</style>