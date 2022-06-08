import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compress from 'compression';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);

  app.enableCors();

  app.use(helmet());
  app.use(compress());

  const PORT = +config.get('app.port');
  await app.listen(PORT);
}
bootstrap();
