
import * as fs from 'fs'
import * as path from 'path'

const uuid = (pre = '', len = 10) => {
  var seed = 'abcdefhijkmnprstwxyz0123456789', maxPos = seed.length;
  var rtn = '';
  for (var i = 0; i < len; i++) {
     rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
}

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
      cssResultString.push(getCssStringFromPath(path.resolve(folderPath, filePath)))
    }
  })
  return cssResultString
}

const getDirPathFromFullPath = (fullPath: string) => {
  return path.dirname(fullPath)
}

const scanUIAssets = (projectFolder: string): Record<string, {fileName: string, fullPath: string}> => {
  const uiPathMap: any = {}
  const _judge = (name: string, baseFolder: string) => {
    const currentPath = path.join(baseFolder, name)
    const isDirectory = fs.statSync(currentPath).isDirectory();
    if(isDirectory) {
      const children = fs.readdirSync(currentPath)
      children.forEach((pathStr) => {
        if(pathStr === '_ui') {
          const tempFolderPath = path.join(currentPath, pathStr)
          const tempFileName = `index.${uuid()}`
          uiPathMap[tempFolderPath] = {
            fileName: tempFileName,
            fullPath: path.join(tempFolderPath, tempFileName + '.js')
          }
        }
        _judge(pathStr, currentPath)
      })
    }
  }
  
  const children = fs.readdirSync(projectFolder)
  children.forEach((pathStr) => {
    _judge(pathStr, projectFolder)
  })
  return uiPathMap
}

export {
  getDirPathFromFullPath,
  scanUIAssets,
  uuid,
  getCssStringFromBaseFolderPath,
  getCssStringFromPath
}
