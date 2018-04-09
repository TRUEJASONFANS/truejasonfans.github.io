---
title: 如何使用webpack构建单页面React应用
date: 2017-06-14 00:00:58
tags: Web前端
---

## entry 
打包的入口文件，有几个入口文件就会生成几个bundle文件


## output
打包后的输出设置
```
output = {
  fileName : [XXX].js // 打包后的文件名
}
```

## loader
打包之前的预处理器，处理各种资源文件

### css loader& style  loader

* css loader 负责解析css文件
* style loader 负责将css style插入到html中

如何在webpack打包中包括css打包?

1. `loaders:[
  { test: /\.css$/, loader: 'style-loader!css-loader' },`
]

2. 以及在root.js中import/require
`require('../css/app.css'); `

语法中的！（感叹号）用来连接link 不同的loader

* url loader 预处理图片资源
```
loaders:[
 { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
]
```

? 用来向loader传入参数，这里表示8192以下用base64转码
### Common chunk
CommonsChunkPlugin 
将脚本中相同chunk块打包成一个单独的文件的插件

### Webpack配置文件中用到的特殊符号
 ! : loader的连接符号 比如 'style-loader!css-loader'

 & : 向loader传递参数

#### 解决：Cannot find module 'webpack/lib/node/NodeTemplatePlugin

```
npm remove webpack -g
npm i webpack --save-dev
npm run ./node_modules/.bin/webpack
```

一个参考模板：

```
var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  context: path.join(__dirname),
  entry: "./src/js/root.js",
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        query: {
          presets: ["react", "es2015", "stage-0"],
          plugins: ["react-html-attrs"] 
        }
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      {
        test: /\.(png|jpg|jpeg)$/,
        loader: "url-loader?limit=8192",
        use: ["file-loader"]
      }
    ]
  },
  entry: {
    app: path.resolve(__dirname, "./src/js/root.js")
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "./src/bundle.js"
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new HtmlWebpackPlugin({
      title: "resume-system-front",
      filename: "app.html",
      template: "./index.html" //Load a custom template
    })
  ]
};
```

