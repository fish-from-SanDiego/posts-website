// noinspection ExceptionCaughtLocallyJS

import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { conflict, notFound } from './exceptions';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupertokensService } from '../auth/supertokens/supertokens.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private stService: SupertokensService,
  ) {}

  async createUser(
    data: CreateUserDto,
    include: Prisma.UserInclude,
  ): Promise<User> {
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
          throw new BadRequestException('Email sign up failed');
        }
        return tx.user.create({
          data: {
            username: data.username,
            supertokensId: signUpResult.user.id,
            profile: {
              create: {} as Prisma.UserProfileCreateWithoutUserInput,
            },
          },
          include: include,
        });
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
        include: options?.include ?? {},
        where: { supertokensId: supertokensId },
      });
      if (user == null) throw notFound();
      return user;
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
  ): Promise<Omit<User, 'supertokensId'>> {
    try {
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
