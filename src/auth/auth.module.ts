import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  MiddlewareConsumer,
  Module,
  NestModule,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';
import { SupertokensService } from './supertokens/supertokens.service';
import {
  AuthModuleConfig,
  SupertokensConfigInjectionToken,
} from './auth.config.type';

@Module({
  imports: [],
  providers: [],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}

  static forRootAsync(options: {
    useFactory: (
      ...args: any[]
    ) => Promise<AuthModuleConfig> | AuthModuleConfig;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    imports?:
      | (
          | Type<any>
          | DynamicModule
          | Promise<DynamicModule>
          | ForwardReference<any>
        )[]
      | undefined;
  }): DynamicModule {
    return {
      providers: [
        {
          useFactory: options.useFactory,
          provide: SupertokensConfigInjectionToken,
          inject: options.inject ?? [],
        },
        SupertokensService,
      ],
      exports: [SupertokensService],
      imports: options.imports,
      module: AuthModule,
    };
  }
}
