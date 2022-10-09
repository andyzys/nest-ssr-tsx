import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
// @ts-ignore
import compression from 'compression';

const DEFAULT_PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  console.log('启动端口', process.env.PORT || DEFAULT_PORT)
  app.use(compression());
  await app.listen(process.env.PORT || DEFAULT_PORT)
}

void bootstrap()
