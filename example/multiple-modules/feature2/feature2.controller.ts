import { Controller, Get, Render } from '@nestjs/common'

@Controller('/feature2')
export class Feature2Controller {
  @Get()
  @Render('index')
  index() {
    return { name: 'Hello' }
  }
}
