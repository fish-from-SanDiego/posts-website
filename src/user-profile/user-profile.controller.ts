import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Render,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { Head } from '../templateModels/head.interface';
import defaultHeader from '../templateModels/header.default';
import defaultFooter from '../templateModels/footer.default';
import { Prisma } from '@prisma/client';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Response } from 'express';
import { notFound } from './exceptions';
import { ApiExcludeController } from '@nestjs/swagger';
import {
  PublicAccess,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { Session } from '../auth/session/session.decorator';
import { SessionContainerInterface } from 'supertokens-node/lib/build/recipe/session/types';
import { SupertokensHtmlExceptionFilter } from '../auth/auth.filter';
import { UserService } from '../user/user.service';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { UserProfileDto } from './response/user-profile.dto';
import { UserProfileHook } from './premissions/user-profile.hook';

@ApiExcludeController(true)
@Controller('users')
@UseFilters(SupertokensHtmlExceptionFilter)
@UseGuards(new SuperTokensAuthGuard())
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  @Render('user/profile/info')
  @PublicAccess()
  async getUserProfile(@Param('id', ParseIntPipe) userId: number) {
    const include: Prisma.UserProfileInclude = {
      user: true,
    };
    const userProfile = await this.userProfileService.profile(
      {
        userId: userId,
      },
      include,
    );

    if (userProfile == null) throw notFound();
    const user = userProfile.user;
    const headInfo: Head = {
      title: user.username,
      description: `Профиль ${user.username}`,
      keywords: 'Профиль',
      specificScripts: [],
      specificModuleScripts: [],
      specificStylesheets: [
        `/resources/styles/user/profile/info.css`,
        `/resources/styles/common/views_default.css`,
      ],
      currentPageSection: 'Профиль',
    };
    return Object.assign(
      {
        layout: 'main',
      },
      {
        ...defaultHeader,
      },
      defaultFooter,
      headInfo,
      {
        username: user.username,
        profileImageUrl: user.pictureUrl,
        status: userProfile.status,
        bio: userProfile.bio,
        userId: user.id,
      },
    );
  }

  @Get(':id/edit')
  @Render('user/profile/edit')
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, UserProfileDto, UserProfileHook)
  async editInfoPage(@Param('id', ParseIntPipe) userId: number) {
    const include: Prisma.UserProfileInclude = {
      user: true,
    };
    const userProfile = await this.userProfileService.profile(
      {
        userId: userId,
      },
      include,
    );
    if (userProfile == null) throw notFound();

    const user = userProfile.user;
    const headInfo: Head = {
      title: `${user.username} - изменение`,
      description: ``,
      keywords: '',
      specificScripts: [],
      specificModuleScripts: [],
      specificStylesheets: [
        `/resources/styles/user/profile/edit.css`,
        `/resources/styles/common/views_default.css`,
      ],
      currentPageSection: 'Профиль',
    };
    return Object.assign(
      { layout: 'main' },
      { ...defaultHeader },
      defaultFooter,
      headInfo,
      {
        username: user.username,
        status: userProfile.status,
        bio: userProfile.bio,
        userId: user.id,
      },
    );
  }

  @Patch(':id')
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, UserProfileDto, UserProfileHook)
  async update(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @Res() res: Response,
  ) {
    const where: Prisma.UserProfileWhereUniqueInput = {
      userId: Number(userId),
    };
    await this.userProfileService.updateProfile(
      where,
      {
        bio: updateUserProfileDto.bio,
        status: updateUserProfileDto.status,
      },
      {},
    );
    return res.redirect(`/users/${userId}`);
  }
}
