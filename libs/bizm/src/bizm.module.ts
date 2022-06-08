import { DynamicModule, Global, Module, ModuleMetadata, Provider } from '@nestjs/common';
import { BizmService } from './bizm.service';
import { BIZM_MODULE_CONFIG } from './bizm.type';

export interface BizmConfig {
  profile: string;
  userid: string;
  sender: string;
}

export interface BizmConfigAsync extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<BizmConfig> | BizmConfig;
}

@Global()
@Module({
  providers: [BizmService],
  exports: [BizmService],
})
export class BizmModule {
  static forRoot(option: BizmConfig): DynamicModule {
    return {
      module: BizmModule,
      providers: [
        {
          provide: BIZM_MODULE_CONFIG,
          useValue: option,
        },
      ],
    };
  }

  static forRootAsync(option: BizmConfigAsync): DynamicModule {
    return {
      module: BizmModule,
      imports: option.imports,
      providers: [
        {
          provide: BIZM_MODULE_CONFIG,
          inject: option.inject || [],
          useFactory: option.useFactory,
        },
      ],
    };
  }
}
