import { Application, Response } from 'express'
import { Context } from 'react'
import {
  EngineCallbackParameters,
  ExpressRenderOptions,
  ReactViewsContext,
  ReactViewsOptions,
} from './react-view-engine.interface'
import * as fs from 'fs'
import { getCssStringFromBaseFolderPath, getDirPathFromFullPath } from '../util'
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
      console.log('@@@@@', userVars, filename)
      const rawComponentStr = `
        <script id="${INJECT_DATA_SCRIPT_ID}" data-obj="${encodeURIComponent(JSON.stringify(userVars))}"></script>
        <script>${fs.readFileSync(filename, 'utf-8')}</script>
      `
      const transform = reactViewOptions.transform || ((html) => {
        const injectCssList = getCssStringFromBaseFolderPath(folderPathOfFile)
        const injectCss = injectCssList.reduce((accu: string, cssStrWithTag: string) => {
          accu += cssStrWithTag
          return accu
        }, '')
        const injectCssTag = `
          <link
            rel="stylesheet"
            type="text/css"
            href="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/antd-4.16.13/dist/antd.min.css"
          />
        `
        const injectScriptTag = `
          <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/react@17.0.2/umd/react.production.min.js"></script>
          <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
          <script crossorigin="anonymous" src="//f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/antd-4.16.13/dist/antd.min.js"></script>
          <script crossorigin="anonymous" src="//f2.eckwai.com/kos/nlav12333/fangzhou/pkg/xlsx.full.min.80e1ddf43c5aa310.js"></script>
        `
        html = `
          <!DOCTYPE html>
          <html lang="zh-CN" class="no-js">
            <head>
              ${injectCssTag}
              ${injectCss}
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
