import * as fs from 'fs'
import * as path from 'path'
import { CLIENT_BUILD_PATH, WEBPACK_MERGED_CONFIG_TMP } from '../common/constant'

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

const getExternalConfig = (): { injectScript?: any[], injectStyle?: any[], template?: string } => {
  let config: any = {}
  const externalConfigPath = path.join(process.cwd(), CLIENT_BUILD_PATH, WEBPACK_MERGED_CONFIG_TMP)
  if(fs.existsSync(externalConfigPath)) {
    try{
      config = JSON.parse(fs.readFileSync(externalConfigPath, 'utf-8'))
    } catch(e) {
      console.log('read external config failed', JSON.stringify(e))
    }
  }
  return config
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

const generateInjectScriptTag = ({ injectScript }: any) => {
  let injectScriptTag = `
    <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/react@17.0.2/umd/react.production.min.js"></script>
    <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
    <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/antd-4.16.13/dist/antd.min.js"></script>
    <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/mybricks/rxui-1.0.84/index.js"></script>
    <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/compiler-js/0.0.15/index.min.js"></script>
    <script crossorigin="anonymous" src="//f2.eckwai.com/kos/nlav12333/fangzhou/pkg/xlsx.full.min.80e1ddf43c5aa310.js"></script>
    <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/dayjs-1.10.7/dayjs.min.js"></script>
    <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/axios/axios.min.js"></script>
  `
  injectScript?.forEach((script: any) => {
    if(typeof script === 'string') {
      injectScriptTag += script
    }
  })
  return injectScriptTag
}

const generateInjectStyleTag = ({ injectStyle }: any) => {
  let injectStyleTag = `
    <link
      rel="stylesheet"
      type="text/css"
      href="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/antd-4.16.13/dist/antd.min.css"
    />
  `
  injectStyle?.forEach((style: any) => {
    if(typeof style === 'string') {
      injectStyleTag += style
    }
  })
  return injectStyleTag
}

export {
  generateInjectStyleTag,
  generateInjectScriptTag,
  getDirPathFromFullPath,
  scanUIAssets,
  uuid,
  getCssStringFromBaseFolderPath,
  getCssStringFromPath,
  getExternalConfig
}
