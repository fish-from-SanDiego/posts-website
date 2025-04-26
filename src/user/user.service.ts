import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { conflict, notFound } from './exceptions';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    data: CreateUserDto,
    include: Prisma.UserInclude,
  ): Promise<User> {
    try {
      return this.prisma.user.create({
        data: {
          username: data.username,
          profile: {
            create: {},
          },
        },
        include: include,
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
      return this.prisma.user.findUnique({
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
      return this.prisma.user.findMany({
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

  private handleError(e): any {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2001' || e.code === 'P2015' || e.code === 'P2025')
        return notFound();
      if (e.code === 'P2002') return conflict();
    }
    return e;
  }
}
