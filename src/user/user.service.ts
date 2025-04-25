import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    data: CreateUserDto,
    include: Prisma.UserInclude,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        username: data.username,
        profile: {
          create: {},
        },
      },
      include: include,
    });
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    include: Prisma.UserInclude,
  ) {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: include,
    });
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
    return this.prisma.user.findMany({
      skip: skip,
      take: take,
      cursor: cursor,
      where: where,
      orderBy: orderBy,
      include: include,
    });
  }
}
