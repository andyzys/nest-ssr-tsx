const path = require('path')
// const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
import { getServerConfigEntry } from './util'
import { SERVER_BUILD_PATH } from '../../common/constant'

const getServerWebpack = (config: {
  baseFolder: string
}) => {
  const serverConfig = {
    entry: getServerConfigEntry(config.baseFolder),
    cache: {
      type: "filesystem", 
    },
    mode: "development",// "production" | "development" | "none"
    output: {
      filename: "[name].js",
      libraryTarget: 'commonjs',
      // globalObject: 'this',
      path: path.join(config.baseFolder, SERVER_BUILD_PATH),
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom'
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
    ]
  }
  return serverConfig
}

export {
  getServerWebpack
}
