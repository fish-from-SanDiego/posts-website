import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserIdParam } from './query/user-id.param';
import { notFound } from './exceptions';
import { CategoryDto } from '../category/responseData/categoryDto';
import { UserDto } from './response/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserUsernameParam } from './query/user-username.param';

@ApiTags('users')
@Controller('api/users')
export class UserApiController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Получить основную информацию о пользователе по id',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное получение пользователя',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'Пользователь с таким id не найден' })
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
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  async updateUser(
    @Param() param: UserIdParam,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser({ id: param.id }, updateUserDto, {});
  }

  @ApiOperation({
    summary: 'Обновить пользователя с id',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное обновление пользователя',
    type: UserDto,
  })
  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Пользователь с таким id не найден' })
  async removeUser(@Param() param: UserIdParam) {
    return this.userService.removeUser({ id: param.id }, {});
  }
}
