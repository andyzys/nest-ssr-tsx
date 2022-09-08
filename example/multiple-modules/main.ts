import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const DEFAULT_PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  console.log('启动端口', process.env.PORT || DEFAULT_PORT)
  await app.listen(process.env.PORT || DEFAULT_PORT)
}

void bootstrap()
