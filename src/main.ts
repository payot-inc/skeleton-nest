import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compress from 'compression';
import { ConfigService } from '@nestjs/config';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV ?? 'development' === 'development' ? 'silly' : 'error',
          format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike('App', { prettyPrint: true })),
        }),
        new DailyRotateFile({
          level: 'info',
          format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike('App', { prettyPrint: true })),
          datePattern: 'YYYYMMDDHH',
          dirname: join(process.cwd(), 'logs'),
          filename: '%DATE%.log',
          maxSize: '20m',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    }),
  });

  const config: ConfigService = app.get(ConfigService);

  app.enableCors();

  app.use(helmet());
  app.use(compress());

  const PORT = +config.get('app.port');
  await app.listen(PORT);
}
bootstrap();
