const HtmlWebPackPlugin = require('html-webpack-plugin')
    , webpack = require('webpack')
    , path = require('path')

module.exports = (env, options) => ({
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    'abortcontroller-polyfill/dist/polyfill-patch-fetch',
    './src/index.js',
  ],
  
  output: {
    path: path.join(__dirname, 'public'),
    filename: `app.js?${(+new Date).toString(32).substr(-5)}`,
    publicPath: '/',
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.BUILD_MODE': JSON.stringify(options.mode),
    })
  ]
})