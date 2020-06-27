const { smart } = require('webpack-merge')
const WebpackBase = require('./webpack.config.base.js')

const { CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = smart(WebpackBase, {
  mode: 'development',
  output: {
    publicPath: './'
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
})
