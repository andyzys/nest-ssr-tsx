import { Module } from '@nestjs/common'
import { Feature1Module } from './feature1/feature1.module'

@Module({
  imports: [Feature1Module],
})
export class AppModule {}
