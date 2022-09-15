const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BUILD_PATH = "build/static"
console.log('!!!!当前目录是：', process.cwd())
console.log('!!!!输出目录是：', path.join(process.cwd(), BUILD_PATH))
const getServerWebpack = () => {
  const serverConfig = {
    entry: {
      test: '/Users/andyzou/Practice/other-github/ssr/nest-ssr-tsx/example/multiple-modules/feature1/_ui/test/index.tsx'
    },
    cache: {
      type: "filesystem", 
    },
    mode: "development",// "production" | "development" | "none"
    output: {
      filename: "[name].js",
      libraryTarget: 'commonjs',
      // globalObject: 'this',
      path: path.join(process.cwd(), BUILD_PATH),
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-react'  // jsx支持
                  //['@babel/preset-env', { useBuiltIns: 'usage', corejs: 2 }] // 按需使用polyfill
                ],
                plugins: [
                  ['@babel/plugin-proposal-class-properties', {'loose': true}] // class中的箭头函数中的this指向组件
                ],
                cacheDirectory: true // 加快编译速度
              }
            }
          ]
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-react'  // jsx支持
                ],
                plugins: [
                  ['@babel/plugin-proposal-class-properties', {'loose': true}] // class中的箭头函数中的this指向组件
                ],
                cacheDirectory: true // 加快编译速度
              }
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.less$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[local]-[hash:5]'
                }
              }
            },
            {loader: 'less-loader'}
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin(),
      // new webpack.DefinePlugin({
      //   'process.env': {
      //     NODE_ENV: JSON.stringify('production')
      //   }
      // }),
      // new webpack.ProvidePlugin({
      //   'React': 'react'
      // }),
  
    ]
  }
  return serverConfig
}

export {
  getServerWebpack
}
