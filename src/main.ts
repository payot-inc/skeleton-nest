import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compress from 'compression';
import { ConfigService } from '@nestjs/config';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const loggingFormatter = winston.format.combine(winston.format.timestamp(), utilities.format.nestLike('App', { prettyPrint: true }));

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV ?? 'development' === 'development' ? 'silly' : 'error',
          format: loggingFormatter,
        }),
        new DailyRotateFile({
          level: 'info',
          format: loggingFormatter,
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
  app.useGlobalPipes(new ValidationPipe());

  const PORT = +config.get('app.port');
  await app.listen(PORT);
}
bootstrap();
