module.exports = {
  lintOnSave: false, //关闭语法检查的
  //关闭map文件 否则打包的时候是加密的代码 不知道哪里出错了
  productionSourceMap: false,
  // 代理跨域
  devServer: {
    proxy: {
      '/api': {// 匹配所有以 '/api'开头的请求路径
        target: 'http://gmall-h5-api.atguigu.cn',// 代理目标的基础路径
        changeOrigin: true,
      },
      // 可以配置多个代理地址
      // '/api': {// 匹配所有以 '/api'开头的请求路径
      //   target: 'http://localhost:5001',// 代理目标的基础路径
      //   changeOrigin: true,
      //   pathRewrite: {'^/api': ''} 重写地址
      // }
    }
  }
}