import { Application, Response } from 'express'
import { Context } from 'react'
import {
  EngineCallbackParameters,
  ExpressRenderOptions,
  ReactViewsContext,
  ReactViewsOptions,
} from './react-view-engine.interface'
import * as fs from 'fs'
import { getCssStringFromBaseFolderPath, getDirPathFromFullPath, generateInjectScriptTag, getExternalConfig, generateInjectStyleTag } from '../util'
import { INJECT_DATA_SCRIPT_ID } from '../common/constant'

export function setupReactViews(
  app: Application,
  options: ReactViewsOptions,
): void {
  if (!options.viewsDirectory) {
    throw new Error('viewsDirectory missing')
  }

  app.engine('js', reactViews(options))
  app.set('view engine', 'js')
  app.set('views', options.viewsDirectory)
}

export function addReactContext<T>(
  res: Response,
  context: Context<T>,
  value: T,
): void {
  const locals = (res as Response<string, ReactViewsContext<T>>).locals
  locals.contexts ??= []
  locals.contexts.unshift([context, value])
}

export function reactViews(reactViewOptions: ReactViewsOptions) {
  return async function renderFile(
    ...args: EngineCallbackParameters
  ): Promise<void> {
    const [filename, options, next] = args
    const { settings, _locals, cache, contexts, ...userVars } = options as ExpressRenderOptions
    const folderPathOfFile = getDirPathFromFullPath(filename)
    try {
      const rawComponentStr = `
        <script id="${INJECT_DATA_SCRIPT_ID}" data-obj="${encodeURIComponent(JSON.stringify(userVars))}"></script>
        <script>${fs.readFileSync(filename, 'utf-8')}</script>
      `
      const transform = reactViewOptions.transform || ((html) => {
        const injectCssList = getCssStringFromBaseFolderPath(folderPathOfFile)
        const injectCssStr = injectCssList.reduce((accu: string, cssStrWithTag: string) => {
          accu += cssStrWithTag
          return accu
        }, '')

        const externalConfig = getExternalConfig()
        const injectScriptTag = generateInjectScriptTag({ injectScript: externalConfig?.injectScript })
        const injectStyleTag = generateInjectStyleTag({ injectStyle: externalConfig?.injectStyle })

        html = `
          <!DOCTYPE html>
          <html lang="zh-CN" class="no-js">
            <head>
              ${injectStyleTag}
              ${injectCssStr}
              ${injectScriptTag}
            </head>
            <body>
              ${html}
            </body>
          </html>   
        `
        return html
      })
      next(null, await transform(rawComponentStr))
    } catch (error) {
      next(error)
    }
  }
}
