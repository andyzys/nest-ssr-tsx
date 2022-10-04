import { Application } from 'express'
import { Context } from 'react'

export interface ReactViewsOptions {
  viewsDirectory?: string
  doctype?: string
  prettify?: boolean
  transform?: (html: string) => string | Promise<string>
}

export type EngineCallbackParameters = Parameters<
  Parameters<Application['engine']>[1]
>

export type ExpressLikeApp = Application

export type ContextDefinition<T = unknown> = [Context<T>, T]

export interface ReactViewsContext<T> {
  contexts: ContextDefinition<T>[]
}

export interface ExpressRenderOptions {
  [name: string]: unknown
  settings: Record<string, unknown>
  _locals: Record<string, unknown>
  cache: unknown
  contexts?: ContextDefinition[]
}
