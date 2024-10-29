const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:"/nekovideo",
  /**
   
   */
  devServer:{
    proxy:"http://127.0.0.1:9100",
    proxy: {
      '/files': {
        target: 'http://127.0.0.1:9100/', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/files': '/files'
        }
      }
    }
  },
  chainWebpack:(config)=>{
    const svgRule = config.module.rule("svg");
    // 清空默认svg规则
    svgRule.uses.clear();
    //针对svg文件添加svg-sprite-loader规则
    svgRule
      .test(/\.svg$/)
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
  }
  
})

