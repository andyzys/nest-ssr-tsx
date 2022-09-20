const webpack = require('webpack')
const { getServerWebpack } = require('./config/index')
const path = require('path')
const fs = require('fs')
import { SERVER_BUILD_PATH } from '../common/constant'

export const buildInfoPath = path.join(process.cwd(), './buildinfo.json');

function build() {
  const index = process.argv.indexOf('--folder')
  const baseFolder = index === -1 ? `${process.cwd()}/server` : path.join(process.cwd(), process.argv[index + 1])
  console.log(`开始编译，编译目录是：${baseFolder}`)
  try {
    const compiler = webpack(getServerWebpack({
      baseFolder: baseFolder
    }));
    compiler.run((err: any, stats: any) => {
      console.log(stats.toString({
        chunks: false,  // 使构建过程更静默无输出
        colors: true    // 在控制台展示颜色
      }))
      const statJson = stats.toJson()
      const chunkMap = statJson.assetsByChunkName
      const buildInfoStr = fs.readFileSync(path.join(baseFolder, 'buildInfo.json'), 'utf8') || '{}'
      const buildInfoMap = JSON.parse(buildInfoStr)
      for(let uiBaseFolderPath in buildInfoMap) {
        const fileObj = buildInfoMap[uiBaseFolderPath]
        const sourcePath = uiBaseFolderPath
        const chunkList = chunkMap[fileObj.fileName]
        for(let i=0; i<chunkList.length; i++) {
          const chunkName = chunkList[i]
          const chunkNameChunks = chunkName.split('.')
          const destName = chunkNameChunks[0] + '.' + chunkNameChunks[chunkNameChunks.length - 1]
          fs.copyFileSync(path.join(baseFolder, SERVER_BUILD_PATH, chunkName), path.join(sourcePath, destName))
        }
      }
      compiler.close((closeErr: any) => {
        console.log('编译完毕')
      });
    });
  } catch (e: any) {
    console.warn(e.message);
  }
}


build()
