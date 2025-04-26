import { Injectable } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { conflict, notFound } from './exceptions';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  async profile(
    where: Prisma.UserProfileWhereUniqueInput,
    include: Prisma.UserProfileInclude,
  ) {
    try {
      return this.prisma.userProfile.findUnique({
        where: where,
        include: include,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async updateProfile(
    where: Prisma.UserProfileWhereUniqueInput,
    data: UpdateUserProfileDto,
    include: Prisma.UserProfileInclude,
  ) {
    try {
      return this.prisma.userProfile.update({
        data: {
          bio: data.bio,
          status: data.status,
          user: data.pictureUrl
            ? {
                update: {
                  pictureUrl: data.pictureUrl,
                },
              }
            : undefined,
        },
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
