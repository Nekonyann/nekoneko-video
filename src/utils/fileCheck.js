import SparkMD5 from 'spark-md5';
import { Message } from 'element-ui';

export function md5(file){
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) =>{
            let spark = new SparkMD5.ArrayBuffer();
            spark.append(e.target.result)
            const md5 = spark.end();
            Message.success("校验完成")
            resolve(md5);
        }    
    fileReader.readAsArrayBuffer(file)
    })
}

export function beforeUpload(){
    let _fileList = this.fileList
    let videolist = ["mp4","flv","mkv","avi","m4v"]
    let data = {}
    _fileList.forEach(item =>{
        let file = item
        // 文件名
        let videoname = file.name
        let pos = videoname.lastIndexOf('.')
        // 文件标题
        let fileTilte = videoname.substring(0, pos)
        // 文件后缀
        let fileType = videoname.replace(/.+\./,"")
        //文件大小
        let fileSize = file.size
        // if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(fileType))
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
        let md5 = this.data.md5
        if(this.data.md5==null){
            this.md5(file)
        }
        })
        return data
}

//格式化文件信息
export function setUploadData(file,md5,type){
    let data = {}
    // 文件名
    let fileName = file.name
    let pos = fileName.lastIndexOf('.')
    // 文件标题
    let fileTilte = fileName.substring(0, pos)
    // 文件后缀
    let extension = fileName.replace(/.+\./,"")
    //文件大小
    let fileSize = file.size
    //格式化文件大小
    let fileSizeformat = VideoTotalSizeformat(fileSize)
    data = {
        'file':file,
        'originalFileName':fileTilte,//文件名
        'fileName':fileName,//文件名+后缀
        'extension':extension,//文件后缀
        'md5':md5,
        'fileSize':fileSize,
        'fileSizeformat':fileSizeformat,
        'fileType':type//文件类型
    }
    return data
}

//格式化文件大小
export function VideoTotalSizeformat(totalSize){
    let formatSize = totalSize; 
    if (totalSize < 1024) {
        formatSize = formatSize.toFixed(2);
        return formatSize + 'B';
    } else if (totalSize < (1024*1024)) {
        formatSize = totalSize / 1024;
        formatSize = formatSize.toFixed(2);
        return formatSize + 'KB';
    } else if (totalSize < (1024*1024*1024)) {
        formatSize = formatSize / (1024*1024);
        formatSize = formatSize.toFixed(2);
        return formatSize + 'MB';
    } else {
        formatSize = totalSize / (1024*1024*1024);
        formatSize = formatSize.toFixed(2);
        return formatSize + 'GB';
    }
}