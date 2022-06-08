import { Global, Module } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import { join } from 'path';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
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
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
