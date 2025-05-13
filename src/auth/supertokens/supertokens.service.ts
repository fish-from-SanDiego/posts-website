// eslint-disable-next-line @typescript-eslint/no-unsafe-call
import { Inject, Injectable } from '@nestjs/common';
import {
  AuthModuleConfig,
  SupertokensConfigInjectionToken,
} from '../auth.config.type';
import supertokens from 'supertokens-node';
import UserRoles from 'supertokens-node/recipe/userroles';
import { Role } from './roles.dto';

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
    this.initRoles()
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  async initRoles() {
    const existingRolesSet = new Set((await UserRoles.getAllRoles()).roles);
    for (const role of Object.values(Role)) {
      if (!existingRolesSet.has(role.toString())) {
        await UserRoles.createNewRoleOrAddPermissions(role.toString(), []);
      }
    }
  }
}
