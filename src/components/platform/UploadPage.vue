<template>
    <div id="app">
        <div class="video-info">
            <div class="file-name">{{ FileData.originalFileName }}</div>
            <div class="file-status">
                    <div class="bg-progress-bar">
                        <p class="progress-bar"></p>
                    </div>
                <p>
                    <span>{{ updateStatus }} NaN MB/{{ FileData.fileSizeformat }} NaN MB/s 剩余时间:NaN秒</span>
                    <span>NaN%</span>
                </p>
            </div>
        </div>
        <div class="video-main">
            <p>基本设置</p>
            <el-form ref="form" :rules="rules" :model="VideoData">
            <el-form-item label="标题" prop="customizeTitle">
                <el-input 
                v-model="VideoData.customizeTitle" 
                maxlength="80"
                show-word-limit
                placeholder="请输入标题">
                </el-input>
            </el-form-item>
            <div>
                <p>上传封面</p>
                <div>点击选择封面
                    <div class="none"><input type="file" ref="file" @change="inpChange" accept=".png"/></div>
                </div>
            </div>
            <el-form-item label="视频简介" prop="profileText">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="简单介绍一下视频~"
                    maxlength="200"
                    show-word-limit
                    v-model="VideoData.profileText">
                </el-input>
            </el-form-item>
            <el-form-item label="禁止转载">
                <el-switch
                v-model="VideoData.copyright"
                active-value=1
                inactive-value=0
                active-color="#13ce66"
                inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item label="分区" prop="region">
                <el-select v-model="VideoData.region" placeholder="请选择分区">
                    <el-option label="暂无" value="-1"></el-option>
                </el-select>
            </el-form-item>
            </el-form>
            <div>(可选)字幕
                <button class="button" @click="showUploadSubtitleDialog()">+上传字幕</button>
            </div>
            <el-dialog
                title="提示"
                :visible.sync="uploadSubtitleDialogVisible"
                width="30%">
                <el-form :model="subData">
                    <el-form-item label="字幕语言">
                    <el-select v-model="subData.lang">
                        <el-option label="中(简体)-日" value="chs"></el-option>
                        <el-option label="中(繁体)-日" value="cht"></el-option>
                    </el-select>
                    <div class="none"><input type="file" ref="file" @change="inpChange" accept=".ass"/></div>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="()=>{uploadSubtitleDialogVisible = false
                        this.$refs.file.value = ''}">取 消</el-button>
                    <el-button type="primary" @click="uploadSubtitle()" :disabled="uploadDisable">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <button @click="save()">保存</button>
    </div>
</template>

<script>
import {uploadSingeFile,checkFileExists,checkChunk,mergeChunk,uploadChunk} from '@/api/FileUp';
import {uploadVideoInfo} from "@/api/Video";
import {setUploadData,md5} from '@/utils/fileCheck';
    export default{
        data(){
            return{
                fileDataList:[],
                //文件信息
                FileData:{
                    md5:null,
                    file:null,
                    totalChunkNum:'', //分片数量
                    successNum:'', //成功上传的分片数
                    originalFileName:'',//文件名
                    fileSizeformat:'',
                    extension:'',//文件后缀名
                    fileType:'',//文件类型
                },
                Option:{
                    maxSize:1024*1024*20, //控制单个分片文件大小(20MB)
                    testChunks:true,
                    threadsCount:1,
                    auto:false
                },
                //视频信息
                VideoData:{
                    customizeTitle:'',//自定义标题
                    originalFileName:'',
                    profileText:'', //简介
                    copyright:0,
                    img:'', //封面
                    uploader:-1,
                    md5:null,
                    subtitles:[]//字幕信息
                },
                subData:{
                    md5:null,
                    file:null,
                    originalFileName:'',
                    extension:'',
                    fileType:'',
                    lang:'',
                    fileSize:0
                },
                updateStatus:"",
                videoUploadSuccess:{value:false},
                subtitleUploadSuccess:{value:false},
                hasFile:false,
                hasChuck:false,
                uploadSubtitleDialogVisible:false,
                uploadDisable:true,
                rules:{
                    customizeTitle:[
                        { required: true, message: '请输入标题', trigger: ['blur','change'] },
                        { max: 80, message: '标题过长', trigger: 'blur' }
                    ],
                    profileText:[
                        { max: 200, message: '简介过长', trigger: 'blur' }
                    ],
                    region:[
                        { required: true, message: '请选择分区', trigger: 'change' }
                    ]
                }
            }
        },
        beforeCreate(){
        },
        mounted(){
            this.fileDataList = this.$route.params
            if(Object.keys(this.$route.params).length||Object.keys(this.fileDataList).length){
                let fileDataList = this.fileDataList
                // fileDataList.forEach(item =>{
                //     this.FileData.file = item.file
                //     this.FileData.fileSize = item.fileSize
                // })
                this.FileData = fileDataList
                this.VideoData.customizeTitle = fileDataList.originalFileName
                console.log(this.FileData)
                this.checkUpate()
            }else {
                this.$router.push({path:'/'})
            } 
        },
        beforeDestroy(){
            this.resetFileData()
        },
        methods:{
            init(){
                
            },
            async inpChange(e){
                this.subData.file=e.target.files[0]
                if(typeof(this.subData.file)!="undefined"){
                    let file = this.subData.file
                    this.$message.info("校验中")
                    let subTitleList = ["ass"]
                    // 文件名
                    let videoname = file.name
                    // 文件后缀
                    let extension = videoname.replace(/.+\./,"")
                    //文件大小
                    let fileSize = file.size
                    if (subTitleList != extension) {
                        this.$message.error('您上传的似乎不是受支持的文件呢~')
                        // 重置
                        this.subData.file=null
                        return
                    }
                    // 限制上传文件的大小
                    const isLt = fileSize / 1024 / 1024 < 10
                    if (!isLt) {
                        this.$message.error('呐呐,文件大小不得大于10MB!')
                        this.subData.file=null
                        return
                    }
                    this.subData.md5 = await md5(this.subData.file)
                    this.uploadDisable=false
                }else{
                    this.uploadDisable=true
                }
            },
            showUploadSubtitleDialog(){
                this.uploadSubtitleDialogVisible = true
            },
            //上传字幕
            async uploadSubtitle(){
                const subtitleInfo = setUploadData(this.subData.file,this.subData.md5,"subtitle")
                let hasFile = await this.checkFile(subtitleInfo)
                if(hasFile){
                    this.$message.success="上传成功"
                }else{
                    await this.uploadSinge(subtitleInfo,this.subtitleUploadSuccess)
                }
                if(this.subtitleUploadSuccess.value){
                    const sub = {
                        type : subtitleInfo.extension,
                        lang : this.subData.lang,
                        md5 : subtitleInfo.md5
                    }
                this.VideoData.subtitles.push(sub)
                console.log(sub)
                console.log(this.VideoData.subtitles)
                this.uploadSubtitleDialogVisible=false
                }
            },
            async checkUpate(){
                this.updateStatus="即将上传"
                let size = this.FileData.fileSize
                let hasFile =await this.checkFile(this.FileData)
                //文件分片判断
                if(size<=this.Option.maxSize){
                    this.updateStatus="上传中"
                    //文件小于分片大小 不存在则上传
                    if(hasFile){
                        this.updateStatus="上传成功"
                    }else{
                        await this.uploadSinge(this.FileData,this.videoUploadSuccess)
                    }
                }else{
                    if(hasFile){
                        this.updateStatus="上传成功"
                    }else{
                        await this.uploadChuck()
                    }
                }
            },
            //检测文件是否存在
            checkFile(FileInfo){
                const data = new FormData();
                data.append("fileMD5",FileInfo.md5)
                return new Promise(function (resolve, reject) {
                    checkFileExists(data).then(async res=>{
                        if(res.data.code ===51001){
                            resolve(true)
                        }else{
                            resolve(false)
                        }
                    })
                })
            },
            /**
             async checkFile(){
                const data = new FormData();
                data.append("fileMD5",this.FileData.md5)
                await axios.post("http://127.0.0.1:9000/v0/video/upload/checkVideo",data).then(async res=>{
                    console.log(res.data)
                    if(res.data.code ===51001){
                        this.hasFile = true
                    }else{
                        this.hasFile = false
                    }
                }).then(()=>{
                    this.updateStatus="校验成功"
                }).catch(()=>{
                    this.updateStatus="校验失败"
                })
            },
             */
            //单文件直接上传
            async uploadSinge(FileInfo,uploadFileStatus){
                console.log(FileInfo)
                console.log(uploadFileStatus)
                const data = new FormData();
                data.append("file",FileInfo.file)
                data.append("fileMD5",FileInfo.md5)
                data.append("uploader",this.$store.state.isLogin.uid)
                data.append("originalFileName",FileInfo.originalFileName)
                data.append("fileType",FileInfo.fileType)
                await uploadSingeFile(data).then(async res=>{
                    console.log(res)
                    if(res.data.code ===50001){
                        this.updateStatus="上传成功"
                        uploadFileStatus.value = true
                    }   
                    if(res.data.code === 20010){
                        this.updateStatus="上传失败"
                        this.$message.error(res.data.message)
                    }
                }).catch(()=>{
                    this.updateStatus="上传失败"
                })
                // await updateVideo(data).then(res =>{
                //     if(res.data.code){
                //         console.log(res.data.message)
                //     }
                // })
            },
            //校验分块文件
            async checkChuck(index){
                const data = new FormData();
                data.append("index",index)
                data.append("fileMD5",this.FileData.md5)
                return new Promise(function (resolve, reject) {
                    checkChunk(data).then(async res=>{
                        if(res.data.code ===51001){
                            resolve(true)
                        }else if(res.data.code===51000){
                            resolve(false)
                        }else{
                            this.updateStatus="检验失败"
                        }
                    })
                })

            },
            //向服务器发送合并请求
            async handleChunkFile(){
                const data = new FormData();
                data.append("chunkTotal",this.FileData.totalChunkNum)
                data.append("fileMD5",this.FileData.md5)
                data.append("type",this.FileData.extension)
                data.append("uploader",this.$store.state.isLogin.uid)
                data.append("originalFileName",this.FileData.originalFileName)
                await mergeChunk(data).then(res=>{
                    if(res.data.code ===50001){
                        this.updateStatus="上传成功"
                        this.videoUploadSuccess.value= true
                    }
                })
            },
            //创建文件分片
            createFileChunk(file,maxSize){
                this.updateStatus="处理中"
                let chunckFileList = [];
                //计算总共分片
                this.FileData.totalChunkNum = Math.ceil(file.size / maxSize)
                console.log(Math.ceil(file.size / maxSize))
                for(let idx =0;idx<this.FileData.totalChunkNum;idx++){
                    let startBytes = idx * maxSize;
                    let endBytes = startBytes + maxSize;
                    if (endBytes > file.size) {
                        endBytes = file.size;
                    }
                    const chunk = file.slice(startBytes, endBytes);
                    chunckFileList.push(chunk);
                }
                return chunckFileList
            },
            //上传分块
            async uploadChuck(){
                this.updateStatus="上传中"
                let chunkFileList = this.createFileChunk(this.fileDataList.file,this.Option.maxSize)
                this.FileData.successNum = 0;
                for(let index = 0;index<this.FileData.totalChunkNum;index++){
                    let chunkFile = chunkFileList[index]
                    let hasChuck =await this.checkChuck(index)
                    console.log(hasChuck)
                    if(!hasChuck){
                        const data = new FormData();
                        data.append("file",chunkFile)
                        data.append("fileMD5",this.FileData.md5)
                        data.append("index",index)
                        await uploadChunk(data).then(res=>{
                            if(res.data.code===50001){
                                console.log(res.data.message)
                                this.FileData.successNum++;
                            }
                        })
                    }else{
                        this.FileData.successNum++;
                    }
                    if(this.FileData.successNum===this.FileData.totalChunkNum){
                            this.handleChunkFile()
                    }
                }
                
                
            },
            // async uploadSubtitle(){
            //     const data = new FormData();
            //     this.VideoData.subtitles.forEach(item =>{
            //         data.append("lang",item.lang)
            //         data.append("type",item.type)
            //         data.append("md5",item.md5)
            //         data.append("uploader",this.$store.state.isLogin.uid)
            //         console.log(data)
            //     })
            // },
            resetFileData(){
                this.FileData = null
            },
            //保存视频信息
            async save(){
                await this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.VideoData.md5 = this.FileData.md5
                        this.VideoData.uploader = this.$store.state.isLogin.uid
                        this.VideoData.originalFileName = this.FileData.originalFileName
                        
                        console.log(this.VideoData)
                        uploadVideoInfo(this.VideoData).then(res =>{
                            if(res.data.code ===20011){
                                this.$message.success("视频上传完成")
                                this.resetFileData()
                                this.$router.push({path:'/'})
                            }else{
                                this.$message.error("上传失败")
                            }
                        })
                    }
                })
            },
        },


    }
</script>

<style>
    .bg-progress-bar{
    height: 20px;
    background-color: aliceblue;
    border-radius: 10px;
    }
    .progress-bar{
        /* background-color:#FFA900; */
        height: 20px;
        min-width: 10px;
        width: 10px;
        align-content: center;
        border-radius: 10px;
        color: #000 !important;
        background: repeating-linear-gradient(115deg,#3cA4E5 0px,#3cA4E5 10px,#388DEA 10px,#0260A0 20px);
        }
</style>