import * as fs from 'fs';
import * as path from 'path';
import { getClientEntry, getReactDomClientEntry } from './client'
import { COMPONENT_ENTRY_PATH, BUILD_TEMP_FOLDER_NAME } from '../../common/constant'
import { uuid } from '../../util/index'

const wrapClientConfig = (webpackConfig: any, {baseFolder}: any) => {
  if(!webpackConfig.entry) {
    return
  }
  let newWebPackConfig = Object.assign({}, webpackConfig)
  let entryMap = newWebPackConfig.entry;
  for(let entryKey in entryMap) {
    const entryPath: string = entryMap[entryKey]
    const entryExtName = path.extname(entryPath)
    const newEntryPath = path.join(baseFolder, `./${BUILD_TEMP_FOLDER_NAME}`,`./index.${uuid()}${entryExtName}`)
    const entryStr: string = newWebPackConfig?.renderMode === 'react' ? getReactDomClientEntry() : getClientEntry()
    const newEntryStr = entryStr.replace(COMPONENT_ENTRY_PATH, entryPath)
    fs.writeFileSync(newEntryPath, newEntryStr)
    newWebPackConfig.entry[entryKey] = newEntryPath
  }
  return newWebPackConfig
}

export {
  wrapClientConfig
}