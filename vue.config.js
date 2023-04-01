const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:"/nekovideo",
  /** 
  devServer:{
    proxy:"http://127.0.0.1:9000",
    proxy: {
      '/files': {
        target: 'http://127.0.0.1:9000/', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/files': '/files'
        }
      }
    }
  }
  */
})

