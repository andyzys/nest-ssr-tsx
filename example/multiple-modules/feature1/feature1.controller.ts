import { Controller, Get, Render } from '@nestjs/common'

@Controller('/')
export class Feature1Controller {
  @Get()
  @Render('./test/index')
  index() {
    return { name: 'Hello' }
  }
}
