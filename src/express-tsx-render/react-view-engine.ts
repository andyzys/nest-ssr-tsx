import { Application, Response } from 'express'
import { Context } from 'react'
import {
  CreateReactContextRenderMiddleware,
  DefaultTsxRenderMiddleware,
  TsxRenderContext,
} from './handler'
import { PrettifyRenderMiddleware } from './handler/middleware/prettify-render.middleware'
import {
  EngineCallbackParameters,
  ExpressRenderOptions,
  ReactViewsContext,
  ReactViewsOptions,
} from './react-view-engine.interface'
import * as fs from 'fs'

const generateCssStr = (cssFilePath: string) => {
  const cssStr = fs.readFileSync(cssFilePath)
  return `<style>${cssStr}</style>`
}

export function isTranspiled(): boolean {
  return require.main?.filename?.endsWith('.js') ?? true
}

export function setupReactViews(
  app: Application,
  options: ReactViewsOptions,
): void {
  if (!options.viewsDirectory) {
    throw new Error('viewsDirectory missing')
  }

  const extension = isTranspiled() ? 'js' : 'tsx'

  // @ts-ignore
  // app.engine(extension, reactViews(options))
  // app.set('view engine', extension)
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
  // eslint-disable-next-line complexity, sonarjs/cognitive-complexity
  return async function renderFile(
    ...args: EngineCallbackParameters
  ): Promise<void> {
    const [filename, options, next] = args

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { settings, _locals, cache, contexts, ...vars } = options as ExpressRenderOptions

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
      console.log('11111', doctype)
      const transform = reactViewOptions.transform || ((html) => {
        const injectCss = generateCssStr('/Users/andyzou/Practice/other-github/ssr/nest-ssr-tsx/build/static/test.css')
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
