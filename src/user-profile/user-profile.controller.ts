import {
  Controller,
  Get,
  Param,
  Render,
  NotFoundException,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { Head } from '../templateModels/head.interface';
import defaultHeader from '../templateModels/header.default';
import defaultFooter from '../templateModels/footer.default';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  // @Post()
  // create(@Body() createUserProfileDto: CreateUserProfileDto) {
  //   return this.userProfileService.create(createUserProfileDto);
  // }
  //
  @Get(':userId')
  @Render('user/profile/info')
  async getUserProfile(@Param('userId') userId: string) {
    const include: Prisma.UserProfileInclude = {
      user: true,
    };
    const userProfile = await this.userProfileService.profile(
      {
        userId: parseInt(userId),
      },
      include,
    );

    if (userProfile == null)
      throw new NotFoundException("A user with that id doesn't exist");
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
      { layout: 'main' },
      { ...defaultHeader, userLoggedIn: true },
      defaultFooter,
      headInfo,
    );
  }

  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userProfileService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserProfileDto: UpdateUserProfileDto,
  // ) {
  //   return this.userProfileService.update(+id, updateUserProfileDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userProfileService.remove(+id);
  // }
}
