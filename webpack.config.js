var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./src/index.js",
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015',"stage-0"],
          "plugins": ["transform-runtime"]
        }
      },
      //下面是使用 ant-design 的配置文件
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
      }
    ]
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings:false
      },
      mangle:{
        except:['$super','$','exports','require']
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ],
  output: {
    path: __dirname + '/src/',
    publicPath:"./",
    filename: "bundle_wx0026.js"
  }
};
