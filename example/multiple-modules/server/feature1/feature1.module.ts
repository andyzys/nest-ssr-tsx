import { Module } from '@nestjs/common'
import { resolve } from 'path'
import { TsxViewsModule } from '../../../../src/nestjs-render/tsx-views.module'
import { Feature1Controller } from './feature1.controller'

@Module({
  imports: [
    TsxViewsModule.register({
      forRoutes: [Feature1Controller],
    }),
  ],
  controllers: [Feature1Controller],
})
export class Feature1Module {}
