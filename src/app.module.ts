import { BizmModule } from '@app/bizm';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    AppConfigModule,
    BizmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('bizm'),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
