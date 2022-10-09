const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
import { CLIENT_BUILD_PATH } from '../../common/constant'

const getClientWebpack = (config: {
  baseFolder: string
}) => {
  const serverConfig = {
    cache: {
      type: "filesystem", 
    },
    mode: process.env.NODE_ENV === 'production' ? "production" : "development", // "production" | "development" | "none"
    output: {
      filename: "[name].js",
      path: path.join(config.baseFolder, CLIENT_BUILD_PATH),
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'antd': 'antd',
      '@mybricks/rxui': 'rxui'
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
      new WebpackBar(),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:6].css",
        chunkFilename: "[id].[contenthash:6].css",
      }),
    ]
  }
  return serverConfig
}

export {
  getClientWebpack
}
