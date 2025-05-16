import {
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserIdParam } from '../user/dto/user-id.param';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfileDto } from './response/user-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  PublicAccess,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { UserProfileHook } from './premissions/user-profile.hook';
import { UserDto } from '../user/dto/user.dto';

@ApiTags('users/{id}/profile')
@UseGuards(new SuperTokensAuthGuard())
@Controller('api/users')
export class UserProfileApiController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Patch(':id/profile')
  @ApiOperation({ summary: 'Обновить профиль пользователя id' })
  @ApiBody({ type: UpdateUserProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Профиль успешно обновлён',
    type: UserProfileDto,
  })
  @ApiNotFoundResponse({
    description: 'Пользователь с id не найден',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiCookieAuth()
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, UserProfileDto, UserProfileHook)
  async updateProfile(
    @Param() param: UserIdParam,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfileService.updateProfile(
      { userId: param.id },
      updateUserProfileDto,
      { user: true },
    );
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Посмотреть профиль пользователя id' })
  @ApiResponse({
    status: 200,
    description: 'Профиль успешно загружен',
    type: UserProfileDto,
  })
  @ApiNotFoundResponse({
    description: 'Пользователь с id не найден',
  })
  @PublicAccess()
  async getProfile(@Param() param: UserIdParam) {
    return this.userProfileService.profile(
      { userId: param.id },
      { user: true },
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Фото успешно обновлено',
    type: UserDto,
  })
  @Patch(':id/profile/picture')
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBody({
    description: 'Изображение профиля',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCookieAuth()
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, UserProfileDto, UserProfileHook)
  @UseInterceptors(FileInterceptor('file'))
  async updatePicture(
    @Param() param: UserIdParam,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image/ }),
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5, // 5 Mb
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const userProfile = await this.userProfileService.getProfileByUserId(
      param.id,
    );
    const newUrl = await this.userProfileService.updatePicture(
      userProfile,
      file,
    );
    const user: UserDto = {
      id: userProfile.userId,
      username: userProfile.user.username,
      pictureUrl: newUrl,
    };
    return user;
  }
}
