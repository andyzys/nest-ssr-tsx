const webpack = require('webpack')
const { getClientWebpack } = require('./config/index')
const path = require('path')
const fs = require('fs')
import { CLIENT_BUILD_PATH, BUILD_TEMP_FOLDER_NAME } from '../common/constant'
import { wrapClientConfig } from './entry/util'

function initTempFolder({ baseFolder }: any) {
  const tmpFolder = path.join(baseFolder, `./${BUILD_TEMP_FOLDER_NAME}`)
  if(!fs.existsSync(tmpFolder)) {
    fs.mkdirSync(tmpFolder)
  }
}

function clearTempFolder({ baseFolder }: any) {
  const tmpFolder = path.join(baseFolder, `./${BUILD_TEMP_FOLDER_NAME}`)
  if(fs.existsSync(tmpFolder)) {
    const files = fs.readdirSync(tmpFolder)
    for(let filePath of files) {
      fs.unlinkSync(path.join(tmpFolder, filePath))
    }
    fs.rmdirSync(tmpFolder)
  }
}


function buildClient() {
  const index = process.argv.indexOf('--folder')
  const baseFolder = index === -1 ? `${process.cwd()}` : path.join(process.cwd(), process.argv[index + 1])
  let userConfig = {}
  initTempFolder({ baseFolder })
  const userWebpackConfigPath = path.join(baseFolder, './webpack.config.override.js')
  if(fs.existsSync(userWebpackConfigPath)) {
    try {
      userConfig = require(userWebpackConfigPath)
    } catch(e) {
      console.error(JSON.stringify(e))
    }
  }
  try {
    const defaultConfig = getClientWebpack({
      baseFolder: baseFolder
    })
    const mergedConfig = Object.assign({}, defaultConfig, userConfig)
    const wrapperMergedConfig = wrapClientConfig(mergedConfig, {baseFolder})
    const compiler = webpack(wrapperMergedConfig);
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
        clearTempFolder({baseFolder})
      });
    });
  } catch (e: any) {
    console.warn(e.message);
  }
}

buildClient()
