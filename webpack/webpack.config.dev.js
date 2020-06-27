
const { smart } = require('webpack-merge')
const webpack = require('webpack')
const WebpackBase = require('./webpack.config.base.js')

module.exports = smart(WebpackBase, {
  mode: 'development',
  output: {
    publicPath: '/'
  },
  devServer: {
    port: 8089,
    // progress: true, // 进度条
    compress: true, // 压缩
    open: true, // 自动打开浏览器
    hot: true, // 热更新
    hotOnly: true // 浏览器不会更新，在控制台显示热更行结果
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map' // 源码映射，会生成单独的source map 文件
  // devtool: 'eval-source-map' // 不会产生单独的文件
  // devtool: 'cheap-module-source-map' // 不会产生列 是一个单独的映射文件
  // devtool: 'cheap-module-eval-source-map' // 不会产生文件 集成在打包文件中 不会产生列
})
