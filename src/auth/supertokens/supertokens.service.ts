// eslint-disable-next-line @typescript-eslint/no-unsafe-call
import { Inject, Injectable } from '@nestjs/common';
import {
  AuthModuleConfig,
  SupertokensConfigInjectionToken,
} from '../auth.config.type';
import supertokens from 'supertokens-node';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(SupertokensConfigInjectionToken) private config: AuthModuleConfig,
  ) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: config.recipeList,
    });
  }
}
