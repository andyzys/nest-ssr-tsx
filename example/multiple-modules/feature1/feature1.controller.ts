import { Controller, Get, Render } from '@nestjs/common'

@Controller('/feature1')
export class Feature1Controller {
  @Get()
  @Render('index')
  index() {
    return { name: 'Hello' }
  }
}
