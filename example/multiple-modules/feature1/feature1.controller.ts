import { Controller, Get, Render } from '@nestjs/common'

@Controller('feature1')
export class Feature1Controller {
  @Get()
  @Render('./test/index')
  index() {
    return { name: 'Hello' }
  }
}
