
import * as fs from 'fs'
import * as path from 'path'

// 从指定路径获取css样式内容
const getCssStringFromPath = (cssFilePath: string): string => {
  const cssStr = fs.readFileSync(cssFilePath)
  return `<style>${cssStr}</style>`
}

// 获取指定文件夹下所有css样式内容
const getCssStringFromBaseFolderPath = (folderPath: string) => {
  const fileListPath = fs.readdirSync(folderPath)
  const cssResultString: string[] = []
  fileListPath?.forEach((filePath: string) => {
    if(filePath.indexOf('.css') !== -1) {
      console.log(path.resolve(folderPath, filePath))
      cssResultString.push(getCssStringFromPath(path.resolve(folderPath, filePath)))
    }
  })
  return cssResultString
}

const getDirPathFromFullPath = (fullPath: string) => {
  return path.dirname(fullPath)
}

getDirPathFromFullPath('/Users/andyzou/Practice/other-github/ssr/nest-ssr-tsx/example/multiple-modules/feature2/_ui/test/index.js')

export {
  getDirPathFromFullPath,
  getCssStringFromBaseFolderPath,
  getCssStringFromPath
}
