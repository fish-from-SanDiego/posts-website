import {
  Controller,
  Get,
  Param,
  Render,
  Query,
  Patch,
  Body,
  Res,
  ParseIntPipe,
  UseGuards,
  UseFilters,
  UnauthorizedException,
  BadRequestException,
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
import { RolesGuard } from '../auth/supertokens/roles.guard';
import { SessionRequest } from 'supertokens-node/framework/express';
import { UserService } from '../user/user.service';

@ApiExcludeController(true)
@Controller('users')
@UseFilters(SupertokensHtmlExceptionFilter)
@UseGuards(new SuperTokensAuthGuard(), RolesGuard)
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly userService: UserService,
  ) {}

  async getUser(req: SessionRequest) {
    const id = req.session?.getUserId();
    if (id == null) throw new UnauthorizedException();
    return await this.userService.getUserBySupertokensId(id);
  }

  private getUserIdParam(req: SessionRequest) {
    try {
      return parseInt(req.params['userId']);
    } catch (e) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }
  }

  @Get(':userId')
  @Render('user/profile/info')
  @PublicAccess()
  async getUserProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
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
      { ...res.locals },
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
      },
    );
  }

  @Get(':userId/edit')
  @Render('user/profile/edit')
  @VerifySession()
  async editInfoPage(
    @Param('userId', ParseIntPipe) userId: number,
    @Session() session: SessionContainerInterface,
  ) {
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

  @Patch(':userId')
  async update(
    @Param('userId', ParseIntPipe) userId: number,
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
        // pictureUrl:updateUserProfileDto.pictureUrl,
      },
      {},
    );
    return res.redirect(`/users/${userId}`);
  }
}
