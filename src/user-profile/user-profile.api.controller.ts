import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserIdParam } from '../user/query/user-id.param';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfileDto } from './response/user-profile.dto';

@ApiTags('users/{id}/profile')
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
  async getProfile(@Param() param: UserIdParam) {
    return this.userProfileService.profile(
      { userId: param.id },
      { user: true },
    );
  }
}
