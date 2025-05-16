import {
  ApiBody,
  ApiConflictResponse,
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
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserIdParam } from './dto/user-id.param';
import { notFound } from './exceptions';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserUsernameParam } from './dto/user-username.param';
import {
  PublicAccess,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { UserHook } from './permissions/user.hook';
import { UserRolesDto } from './dto/user.roles';

@ApiTags('users')
@Controller('api/users')
@UseGuards(new SuperTokensAuthGuard())
export class UserApiController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Получить основную информацию о пользователе по id',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное получение пользователя',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'Пользователь с таким id не найден' })
  @Get(':id')
  @PublicAccess()
  async getUser(@Param() param: UserIdParam) {
    const res = await this.userService.user(
      {
        id: param.id,
      },
      {},
    );
    if (res == null) throw notFound();
    return res;
  }

  @Get()
  @ApiOperation({
    summary: 'Получить основную информацию о пользователе по username',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное получение пользователя',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'Пользователь с таким username не найден',
  })
  @PublicAccess()
  async getUserByUsername(@Query() query: UserUsernameParam) {
    const res = await this.userService.user(
      {
        username: query.username,
      },
      {},
    );
    if (res == null) throw notFound();
    return res;
  }

  @ApiOperation({
    summary: 'Обновить пользователя с id',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное обновление пользователя',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'Пользователь с таким id не найден' })
  @ApiConflictResponse({
    description: 'Пользователь с таким username уже существует',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBody({ type: UpdateUserDto })
  @ApiCookieAuth()
  @Patch(':id')
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, UserDto, UserHook)
  async updateUser(
    @Param() param: UserIdParam,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser({ id: param.id }, updateUserDto, {});
  }

  @ApiOperation({
    summary: 'Получить роли пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешно получили',
    example: ['user'],
  })
  @ApiNotFoundResponse({ description: 'Пользователь с таким id не найден' })
  @Get(':id/roles')
  @PublicAccess()
  async getRoles(@Param() param: UserIdParam) {
    return await this.userService.getUserRolesById(+param.id);
  }

  @ApiOperation({
    summary: 'Обновить роль пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное обновление роли пользователя',
  })
  @ApiNotFoundResponse({ description: 'Пользователь с таким id не найден' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBody({ type: UserRolesDto })
  @ApiCookieAuth()
  @Patch(':id/roles')
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.manage, UserDto, UserHook)
  async updateRoles(
    @Param() param: UserIdParam,
    @Body() userRoles: UserRolesDto,
  ) {
    await this.userService.updateUserRolesById(+param.id, userRoles.roles);
    return;
  }

  @ApiOperation({
    summary: 'Удалить пользователя с id',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное удаление пользователя',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'Пользователь с таким id не найден' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiCookieAuth()
  @Delete(':id')
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, UserDto, UserHook)
  async removeUser(@Param() param: UserIdParam) {
    return this.userService.removeUser({ id: +param.id }, {});
  }
}
