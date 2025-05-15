import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SupertokensService } from '../auth/supertokens/supertokens.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  PublicAccess,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { Session } from '../auth/session/session.decorator';
import { SessionContainerInterface } from 'supertokens-node/lib/build/recipe/session/types';

@ApiTags('user-session')
@Controller('api/users')
@UseGuards(new SuperTokensAuthGuard())
export class UserSessionApiController {
  constructor(
    private readonly userService: UserService,
    private readonly stService: SupertokensService,
  ) {}

  @Post('login')
  @PublicAccess()
  @ApiOperation({
    summary: 'Зайти в аккаунт',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный логин',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Неправильные данные' })
  async login(
    @Body() data: LoginUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    const [user, stUser] = await this.userService.loginUser(
      data.email,
      data.password,
    );
    await this.stService.createSession(req, res, stUser, {
      userId: user.id,
      username: user.username,
    });
    res.status(HttpStatus.OK);
    return {
      id: user.id,
      username: user.username,
      pictureUrl: user.pictureUrl,
    };
  }

  @Post('register')
  @PublicAccess()
  @ApiOperation({
    summary: 'Зарегистрироваться',
  })
  @ApiResponse({
    status: 201,
    description: 'Успешная регистрация',
    type: UserDto,
  })
  @ApiConflictResponse({ description: 'Логин или почта уже существуют' })
  async register(@Body() data: CreateUserDto): Promise<UserDto> {
    const [user, stUser] = await this.userService.createUser(data, {});
    return {
      id: user.id,
      username: user.username,
      pictureUrl: user.pictureUrl,
    };
  }

  @Post('logout')
  @VerifySession({ options: { checkDatabase: true } })
  @ApiOperation({ summary: 'Выйти из аккаунта' })
  @ApiResponse({ status: 200, description: 'Успешный logout' })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @ApiCookieAuth()
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Session() session: SessionContainerInterface,
  ) {
    await this.stService.revokeSession(session.getHandle());
    res.clearCookie('sAccessToken');
    res.status(200);
    return;
  }
}
