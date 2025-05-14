// eslint-disable-next-line @typescript-eslint/no-unsafe-call
import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import {
  AuthModuleConfig,
  SupertokensConfigInjectionToken,
} from '../auth.config.type';
import supertokens from 'supertokens-node';
import UserRoles from 'supertokens-node/recipe/userroles';
import { Role } from './roles.dto';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class SupertokensService
  implements OnModuleInit, OnApplicationBootstrap
{
  constructor(
    @Inject(SupertokensConfigInjectionToken) private config: AuthModuleConfig,
  ) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        Dashboard.init(),
        EmailPassword.init(),
        Session.init({
          getTokenTransferMethod: (input) => {
            return 'cookie';
          },
        }),
        UserRoles.init(),
      ],
    });
  }

  async onApplicationBootstrap() {
    await this.initRoles();
  }

  async onModuleInit() {}

  async initRoles() {
    const existingRolesSet = new Set((await UserRoles.getAllRoles()).roles);
    const appRolesSet = new Set(Object.values(Role).map((it) => it.toString()));
    for (const role of appRolesSet) {
      if (!existingRolesSet.has(role)) {
        await UserRoles.createNewRoleOrAddPermissions(role.toString(), []);
      }
    }
    for (const role of existingRolesSet) {
      if (!appRolesSet.has(role)) {
        await UserRoles.deleteRole(role);
      }
    }
    console.log((await UserRoles.getAllRoles()).roles);
  }

  async signUpEmail(email: string, password: string) {
    return EmailPassword.signUp('public', email, password);
  }

  async signInEmail(email: string, password: string) {
    return EmailPassword.signIn('public', email, password);
  }
}
