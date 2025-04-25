import { Injectable } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  async profile(
    where: Prisma.UserProfileWhereUniqueInput,
    include: Prisma.UserProfileInclude,
  ) {
    return this.prisma.userProfile.findUnique({
      where: where,
      include: include,
    });
  }

  async updateProfile(
    where: Prisma.UserProfileWhereUniqueInput,
    data: UpdateUserProfileDto,
    include: Prisma.UserProfileInclude,
  ) {
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
  }
}
