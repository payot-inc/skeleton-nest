import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configLoader from './config.loader';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configLoader],
      isGlobal: true,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
