import { Controller, Get, Render } from '@nestjs/common'

@Controller('/feature2')
export class Feature2Controller {
  @Get()
  @Render('feature2')
  index() {
    return { name: 'Hello' }
  }
}
