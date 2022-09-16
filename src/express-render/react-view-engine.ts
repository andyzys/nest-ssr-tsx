import { Application, Response } from 'express'
import { Context } from 'react'
import {
  CreateReactContextRenderMiddleware,
  DefaultTsxRenderMiddleware,
  TsxRenderContext,
} from './handler'
import {
  EngineCallbackParameters,
  ExpressRenderOptions,
  ReactViewsContext,
  ReactViewsOptions,
} from './react-view-engine.interface'
import * as fs from 'fs'
import { getCssStringFromBaseFolderPath, getDirPathFromFullPath } from '../util'

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
  console.log('外部执行了')
  return async function renderFile(
    ...args: EngineCallbackParameters
  ): Promise<void> {
    const [filename, options, next] = args
    const { settings, _locals, cache, contexts, ...vars } = options as ExpressRenderOptions
    const folderPathOfFile = getDirPathFromFullPath(filename)
    try {
      console.log('渲染回调参数是: ', args)
      const Component = (await import(filename)).default

      if (!Component) {
        throw new Error(`Module ${filename} does not have a default export`)
      }

      let context = new TsxRenderContext(Component, vars)

      const defaultRenderer = new DefaultTsxRenderMiddleware()

      const middlewares = reactViewOptions.middlewares ?? []

      contexts?.forEach(([Context, props]) => {
        middlewares.push(new CreateReactContextRenderMiddleware(Context, props))
      })

      context = defaultRenderer.createElement(context)

      if (!context.hasElement()) {
        throw new Error('element was not created')
      }

      context = await defaultRenderer.render(context)

      if (!context.isRendered) {
        throw new Error('element was not rendered')
      }

      const doctype = reactViewOptions.doctype ?? '<!DOCTYPE html>\n'
      const transform = reactViewOptions.transform || ((html) => {
        
        const injectCssList = getCssStringFromBaseFolderPath(folderPathOfFile)
        const injectCss = injectCssList.reduce((accu: string, cssStrWithTag: string) => {
          accu += cssStrWithTag
          return accu
        }, '')
        const injectScript = ''
        html = `
          ${injectCss}
          ${html}
          ${injectScript}
        `
        return html
      })
      next(null, await transform(doctype + context.html!))
    } catch (error) {
      next(error)
    }
  }
}
