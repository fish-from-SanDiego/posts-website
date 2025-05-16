import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { conflict, notFound } from './exceptions';
import { UpdateUserProfileRawDto } from './dto/update-user-profile.raw.dto';
import { UserProfileDto } from './response/user-profile.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UserProfileService {
  constructor(
    private prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async profile(
    where: Prisma.UserProfileWhereUniqueInput,
    include: Prisma.UserProfileInclude,
  ) {
    try {
      return await this.prisma.userProfile.findUnique({
        where: where,
        include: include,
      });
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async getProfileByUserId(userId: number) {
    try {
      const profile = await this.prisma.userProfile.findUnique({
        where: { userId: userId },
        include: { user: true },
      });
      if (profile == null) throw notFound();
      return profile;
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async updateProfile(
    where: Prisma.UserProfileWhereUniqueInput,
    data: UpdateUserProfileRawDto,
    include: Prisma.UserProfileInclude,
  ) {
    try {
      return await this.prisma.userProfile.update({
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

  async updatePicture(userProfile: UserProfileDto, file: Express.Multer.File) {
    if (userProfile.user.pictureUrl != null) {
      const oldSubPath = this.storageService.getSubPath(
        userProfile.user.pictureUrl,
      );
      await this.storageService.deleteFile(oldSubPath);
    }
    const subPath = this.storageService.getUserPictureSubPath(
      userProfile.userId,
    );
    const newUrl = await this.storageService.uploadFile(file, subPath);
    await this.updateProfile(
      {
        userId: userProfile.userId,
      },
      {
        pictureUrl: newUrl,
      },
      {},
    );
    return newUrl;
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
