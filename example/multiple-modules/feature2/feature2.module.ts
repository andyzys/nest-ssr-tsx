import { Module } from '@nestjs/common'
import { resolve } from 'path'
import { TsxViewsModule } from '../../../src/nestjs-render/tsx-views.module'
import { Feature2Controller } from './feature2.controller'

@Module({
  imports: [
    TsxViewsModule.register({
      viewsDirectory: resolve(__dirname, './_ui'),
      prettify: true,

      forRoutes: [Feature2Controller],
    }),
  ],
  controllers: [Feature2Controller],
})
export class Feature2Module {}
