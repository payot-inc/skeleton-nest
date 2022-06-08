import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { utilities, WinstonModule } from 'nest-winston';
import { join } from 'path';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        const format = winston.format.combine(winston.format.timestamp(), utilities.format.nestLike());
        return {
          transports: [
            new winston.transports.Console({
              level: 'silly',
              format,
            }),
            process.env.NODE_ENV === 'production' &&
              new DailyRotateFile({
                level: 'silly',
                format,
                datePattern: 'YYYY-MM-DD',
                dirname: join(process.cwd(), 'logs'),
                maxFiles: 30,
                zippedArchive: true,
              }),
          ],
        };
      },
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
