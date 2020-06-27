const { smart } = require('webpack-merge')
const WebpackBase = require('./webpack.config.base.js')

const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = smart(WebpackBase, {
  mode: 'production',
  output: {
    publicPath: './'
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  optimization: { // 优化项
    minimizer: [
      new UglifyjsWebpackPlugin({
        uglifyOptions:{
          cache: true, //是否缓存
          parallel: true, // 一起压缩多个
          sourceMap: true, // 源码映射
          compress: {
            // 在UglifyJs删除没有用到的代码时不输出警告
            // warnings: false,
            // 删除所有的 `console` 语句，可以兼容ie浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
          }
        },
      }), // 压缩js
      new OptimizeCssAssetsWebpackPlugin({
        // assetNameRegExp: /(?:index|bind|login)\.css/g,  //需要根据自己打包出来的文件名来写正则匹配
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          parser: require('postcss-safe-parser'),
          autoprefixer: true
        },
        canPrint: true
      }) // 压缩css
    ]
  }
})

