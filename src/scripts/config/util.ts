import * as fs from 'fs';
import * as path from 'path';
import { scanUIAssets } from '../../util/index'
const getServerConfigEntry = (projectFolder: string) => {
  const entry: any = {}
  const uiMap = scanUIAssets(projectFolder)
  // fs.writeFileSync(path.join(projectFolder, 'buildInfo.json'), JSON.stringify(uiMap, null, 4))
  for(let key in uiMap) {
    const fileObj = uiMap[key]
    entry[fileObj.fileName] = `${key}/index.tsx`
  }
  return entry
}
export {
  getServerConfigEntry
}