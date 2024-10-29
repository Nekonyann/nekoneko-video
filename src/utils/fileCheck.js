import SparkMD5 from 'spark-md5';
import { Message } from 'element-ui';

export const md5 = (file) =>{
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

/**
 * (待修改)多文件校验
 * @param {*} fileList 文件列表
 * @param {*} checkFileType 需要检测的类型
 * @param {*} maxSize 单位为B , 1G=1*1024*1024*1024
 * @returns 
 */
export const beforeUploadMultiFileCheck = (fileList,checkFileType,maxSize) =>{
    let _fileList = fileList
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
        let result = checkFileType.some(item =>{
            return item == fileType
        })
        if (result==false) {
            this.$message.error('您上传的似乎不是受支持的文件呢~')
            // 重置视频列表
            return
        }
        // 限制上传文件的大小
        const isLt = fileSize < maxSize
        if (!isLt) {
            this.$message.error(`呐呐,文件大小不得大于${VideoTotalSizeformat(maxSize)}!`)
            return
        }
        let md5 = this.data.md5
        if(this.data.md5==null){
            this.md5(file)
        }
        })
        return data
}

/**
 * 单文件校验
 * @param {*} file 文件
 * @param {*} checkFileType 需要检测的类型
 * @param {*} maxSize 单位为B , 1G=1*1024*1024*1024
 * @returns true/false 是否验证通过
 */
export const beforeUploadSingleFileCheck = (file,checkFileType,maxSize) =>{
    Message.info("校验中")
    // 文件名
    let videoname = file.name
    // 文件后缀
    let extension = videoname.replace(/.+\./,"")
    //文件大小
    let fileSize = file.size
    if (checkFileType != extension) {
        Message.error('您上传的似乎不是受支持的文件呢~')
        return false
    }
    // 限制上传文件的大小
    const isLt = fileSize / 1024 / 1024 < maxSize
    if (!isLt) {
        Message.error(`呐呐,文件大小不得大于${VideoTotalSizeformat(maxSize)}!`)
        return false
    }
    return true
}
//格式化文件信息
export const setUploadData = (file,md5,type) =>{
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

export const getFileBasicInfo = () =>{

}
//格式化文件大小
export const VideoTotalSizeformat = (totalSize) =>{
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