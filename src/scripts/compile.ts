const webpack = require('webpack')
const { getClientWebpack } = require('./config/index')
const path = require('path')
const fs = require('fs')
import { CLIENT_BUILD_PATH } from '../common/constant'

function buildClient() {
  const index = process.argv.indexOf('--folder')
  const baseFolder = index === -1 ? `${process.cwd()}` : path.join(process.cwd(), process.argv[index + 1])
  let userConfig = {}
  if(fs.existsSync(path.join(baseFolder, './webpack.config.override.js'))) {
    try {
      userConfig = require(path.join(baseFolder, './webpack.config.override.js'))
    } catch(e) {
      console.error(JSON.stringify(e))
    }
  }
  try {
    const defaultConfig = getClientWebpack({
      baseFolder: baseFolder
    })
    const mergedConfig = Object.assign({}, defaultConfig, userConfig)
    // console.log(mergedConfig)
    const compiler = webpack(mergedConfig);
    compiler.run((err: any, stats: any) => {
      console.log(stats.toString({
        chunks: false,  // 使构建过程更静默无输出
        colors: true    // 在控制台展示颜色
      }))
      const statJson = stats.toJson()
      const chunkMap = statJson.assetsByChunkName
      let chunkPathMap: any = {}
      for(let entryKey in chunkMap) {
        const chunkList = chunkMap[entryKey]
        chunkPathMap[entryKey] = {}
        for(let chunkName of chunkList) {
          if(chunkName.indexOf('.js') !== -1) {
            chunkPathMap[entryKey]['js'] = path.join(baseFolder, CLIENT_BUILD_PATH, chunkName)
          } else if(chunkName.indexOf('.css') !== -1){
            chunkPathMap[entryKey]['css'] = path.join(baseFolder, CLIENT_BUILD_PATH, chunkName)
          }
        }
      }
      fs.writeFileSync(path.join(baseFolder, CLIENT_BUILD_PATH, 'buildInfo.json'), JSON.stringify(chunkPathMap, null, 4))
      compiler.close((closeErr: any) => {
        console.log('编译完毕')
      });
    });
  } catch (e: any) {
    console.warn(e.message);
  }
}

buildClient()
