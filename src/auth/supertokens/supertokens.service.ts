/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthModuleConfig,
  SupertokensConfigInjectionToken,
} from '../auth.config.type';
import supertokens, { RecipeUserId, User as STUser } from 'supertokens-node';
import UserRoles from 'supertokens-node/recipe/userroles';
import { Role } from './roles.dto';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';
import Session from 'supertokens-node/recipe/session';
import { notFound } from '../../user/exceptions';

@Injectable()
export class SupertokensService implements OnModuleInit {
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

  async onModuleInit() {
    await this.initRoles();
  }

  private async initRoles() {
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

  async deleteAccountById(supertokensUserId: string) {
    return supertokens.deleteUser(supertokensUserId);
  }

  async assignRole(supertokensUserId: string, role: Role) {
    return UserRoles.addRoleToUser(
      'public',
      supertokensUserId,
      role.toString(),
    );
  }

  async removeRoleFromUser(supertokensUserId: string, role: Role) {
    return UserRoles.removeUserRole(
      'public',
      supertokensUserId,
      role.toString(),
    );
  }

  async findUsersByEmail(email: string) {
    return supertokens.listUsersByAccountInfo('public', { email: email });
  }

  async createSession(
    req: any,
    res: any,
    stUser: { recipeUserId: RecipeUserId; user: STUser },
    accessTokenPayload?: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Session.createNewSession(
      req,
      res,
      'public',
      stUser.recipeUserId,
      accessTokenPayload,
    );
  }

  async revokeSession(handle: string) {
    return Session.revokeSession(handle);
  }

  async getEmailByStId(stId: string): Promise<string> {
    const user = await supertokens.getUser(stId);
    if (user == null)
      throw new NotFoundException('Нет пользователя с таким Id');
    return user.emails[0];
  }
}
