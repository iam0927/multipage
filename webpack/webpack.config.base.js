
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let NODE_ENV = process.env.NODE_ENV == 'production' ? true : false

let MiniCss = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    publicPath: '../'
  }
}

/**
*由于存在一个html包含引入多个js的情况，入口文件名取html名
*因此，每个html都只包含对应名称的入口js，额外的js由import从入口文件引入。
*额外的js不包含插件，类库，公共方法，请用src引入
 */
let readDir = fs.readdirSync("./src/");

let entry = {}
let htmlTemplate = []
readDir.forEach(item => {
  if (item.indexOf('.html') > 0) {
    var key = item.slice(0, item.length - 5)
    entry[key] = './src/js/' + key + '.js'
    htmlTemplate.push(
      new HtmlWebpackPlugin({
        filename: key + '.html',//打包后的文件名
        minify: NODE_ENV,
        chunks: [key],//每个html只引入对应的js和css
        inject: true,
        hash: true, //避免缓存js。
        template: './src/' + key + '.html' //打包html模版的路径和文件名称
      })
    )
  }
})

module.exports = {
  entry: entry,
  output: {
    filename: 'js/[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
  },
  // resolve: { // 解析第三方 包
  //   modules: [path.resolve('node_modules')],
  //   extensions: ['.js', 'css', 'json']
  // },
  module: { // 模块
    rules: [ // 处理相应的规则
      { // 处理css
        test: /\.css$/,
        use: [
          NODE_ENV ? MiniCss : 'style-loader',
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',

          }
        ]
      },
      { // 处理less文件
        test: /\.less$/,
        use: [
          NODE_ENV ? MiniCss : 'style-loader',
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env' // 调用它来处理js文件
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose": true }]
              ]
            }
          }
        ]
      },
      { // 处理css js中引入的图片
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            // 做一个限制 当图片的大小没有超过限制，转化为base64
            // loader: 'file-loader'
            loader: 'url-loader',
            options: {
              // 如果图片小于200kb则转换为base64 超过限制后使用真实的路径
              limit: 20 * 1024,
              outputPath: 'images',
              esModule: false, // 该项默认为true，改为false即可
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              disable: true, // webpack@2.x and newer
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: true,
              },
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-withimg-loader',
          }
        ]
      }
    ]
  },
  plugins: [
    ...htmlTemplate,
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:8].css' // 抽离后的css文件
    }),
    // new webpack.ProvidePlugin({
      // $: 'jquery' // 在每个模块中注入$符
      /**
       * 留坑给window.$
       */
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/assets',
          to: './assets',
        },
      ],
    }),
    new webpack.BannerPlugin('Copyright © 2020 平安健康 All rights reserved.') // 版权声明
  ]
}