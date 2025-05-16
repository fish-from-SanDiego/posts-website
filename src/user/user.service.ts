// noinspection ExceptionCaughtLocallyJS

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { conflict, notFound } from './exceptions';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupertokensService } from '../auth/supertokens/supertokens.service';
import { ConfigService } from '@nestjs/config';
import { ConfigNamespaces } from '../config/config.namespaces';
import { AdminConfig } from '../config/admin.config.type';
import { Role } from '../auth/supertokens/roles.dto';
import supertokens, { RecipeUserId, User as STUser } from 'supertokens-node';
import { UserDto } from './dto/user.dto';
import UserRoles from 'supertokens-node/recipe/userroles';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService<ConfigNamespaces>,
    private stService: SupertokensService,
    private readonly storageService: StorageService,
  ) {}

  async onModuleInit() {
    const adminConfig = this.configService.getOrThrow<AdminConfig>('admin');
    const usernameExists =
      (await this.user({ username: adminConfig.username }, {})) != null;
    const emailExists =
      (await this.stService.findUsersByEmail(adminConfig.email)).length !== 0;
    // const passwordExists = ...
    // (just kidding)
    if (!usernameExists && !emailExists) {
      const [admin, stAdmin] = await this.createUser(
        {
          username: adminConfig.username,
          email: adminConfig.email,
          password: adminConfig.password,
        },
        {},
      );
      await this.stService.assignRole(stAdmin.user.id, Role.Admin);
    }
  }

  async createUser(
    data: CreateUserDto,
    include: Prisma.UserInclude,
    role?: Role,
  ): Promise<[User, { user: STUser; recipeUserId: RecipeUserId }]> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const usernameExists =
          (await tx.user.findUnique({
            where: { username: data.username },
          })) != null;
        if (usernameExists)
          throw new ConflictException('User sign up: username already exists');
        const signUpResult = await this.stService.signUpEmail(
          data.email,
          data.password,
        );
        if (signUpResult.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
          throw new ConflictException('User sign up: email already exists');
        } else if (signUpResult.status !== 'OK') {
          throw new InternalServerErrorException();
        }
        if (role) {
          const rolesResult = await this.stService.assignRole(
            signUpResult.user.id,
            Role.User,
          );
          if (rolesResult.status === 'UNKNOWN_ROLE_ERROR')
            throw new InternalServerErrorException();
        }
        return [
          await tx.user.create({
            data: {
              username: data.username,
              supertokensId: signUpResult.user.id,
              profile: {
                create: {} as Prisma.UserProfileCreateWithoutUserInput,
              },
            },
            include: include,
          }),
          signUpResult,
        ];
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    include: Prisma.UserInclude,
  ) {
    try {
      return await this.prisma.user.findUnique({
        where: userWhereUniqueInput,
        include: include,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async findUserByUsername(
    username: string,
    options?: { include?: Prisma.UserInclude; omit?: Prisma.UserOmit },
  ) {
    try {
      return await this.prisma.user.findUnique({
        where: { username: username },
        include: options?.include ?? {},
        omit: options?.omit ?? {},
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async getUserById(id: number, options?: { include?: Prisma.UserInclude }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id },
        include: options?.include ?? {},
      });
      if (user == null) throw notFound();
      return user;
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async getUserRolesById(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: +userId },
        omit: { supertokensId: false },
      });
      if (user == null) throw notFound();
      const stId = user.supertokensId;
      return (await UserRoles.getRolesForUser('public', stId)).roles;
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async updateUserRolesById(userId: number, roles: Role[]) {
    const rolesSet = new Set(roles);
    if (rolesSet.has(Role.Admin)) throw new ForbiddenException();
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: +userId },
        omit: { supertokensId: false },
      });
      if (user == null) throw notFound();
      const stId = user.supertokensId;
      for (const role of (await UserRoles.getRolesForUser('public', stId))
        .roles) {
        await UserRoles.removeUserRole('public', stId, role);
      }
      for (const role of rolesSet) {
        await this.stService.assignRole(stId, role);
      }
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    include?: Prisma.UserInclude;
  }) {
    const { skip, take, cursor, where, orderBy, include } = params;
    try {
      return await this.prisma.user.findMany({
        skip: skip,
        take: take,
        cursor: cursor,
        where: where,
        orderBy: orderBy,
        include: include,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async getUserBySupertokensId(
    supertokensId: string,
    options?: {
      include?: Prisma.UserInclude;
    },
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        include: options?.include,
        where: { supertokensId: supertokensId },
      });
      if (user == null) throw notFound();
      return user;
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async loginUser(
    email: string,
    password: string,
    options?: { include?: Prisma.UserInclude },
  ): Promise<[User, { user: STUser; recipeUserId: RecipeUserId }]> {
    try {
      const result = await this.stService.signInEmail(email, password);
      if (result.status === 'WRONG_CREDENTIALS_ERROR') {
        throw new UnauthorizedException('Неверные данные');
      } else if (result.status !== 'OK') {
        throw new InternalServerErrorException();
      }
      const stUserResult = result;
      return [
        await this.getUserBySupertokensId(stUserResult.user.id, options),
        stUserResult,
      ];
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: UpdateUserDto,
    include: Prisma.UserInclude,
  ): Promise<Omit<User, 'supertokensId'>> {
    try {
      return await this.prisma.user.update({
        where: where,
        data: data,
        include: include,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async removeUser(
    where: Prisma.UserWhereUniqueInput,
    include: Prisma.UserInclude,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: where,
        include: include,
        omit: { supertokensId: false },
      });
      if (!user) throw notFound();
      const removeResult = await this.stService.deleteAccountById(
        user.supertokensId,
      );
      if (removeResult.status !== 'OK')
        throw new InternalServerErrorException();
      if (user.pictureUrl != null) {
        const subPath = this.storageService.getSubPath(user.pictureUrl);
        await this.storageService.deleteFile(subPath);
      }
      return await this.prisma.user.delete({
        where: where,
        include: include,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  private handleError(e): any {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2001' || e.code === 'P2015' || e.code === 'P2025')
        return notFound();
      if (e.code === 'P2002') return conflict();
    }
    return e;
  }
}
