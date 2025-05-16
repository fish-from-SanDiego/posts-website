import { Controller, Get, Render, UseFilters, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SupertokensHtmlExceptionFilter } from '../auth/auth.filter';
import { PublicAccess, SuperTokensAuthGuard } from 'supertokens-nestjs';
import { Head } from '../templateModels/head.interface';
import defaultHeader from '../templateModels/header.default';
import defaultFooter from '../templateModels/footer.default';

@ApiExcludeController(true)
@Controller()
@UseFilters(SupertokensHtmlExceptionFilter)
@UseGuards(new SuperTokensAuthGuard())
export class UserController {
  @Get('register')
  @Render('user/account/register')
  @PublicAccess()
  getRegisterPage() {
    const headInfo: Head = {
      title: 'Регистрация',
      description: 'Регистрация',
      keywords: 'Регистрация',
      specificScripts: [],
      specificModuleScripts: [
        `/resources/js/user/account/show-hide-password.js`,
        `/resources/js/user/account/register.js`,
      ],
      specificStylesheets: [
        `/resources/styles/common/views_default.css`,
        `/resources/styles/user/account/register.css`,
      ],
      currentPageSection: '',
    };
    return Object.assign(
      { layout: 'main' },
      { ...defaultHeader },
      defaultFooter,
      headInfo,
      {
        logoPath: 'resources/images/logo_current.png',
      },
    );
  }

  @Get('login')
  @Render('user/account/login')
  @PublicAccess()
  getLoginPage() {
    const headInfo: Head = {
      title: 'Логин',
      description: 'Логин',
      keywords: 'Логин',
      specificScripts: [],
      specificModuleScripts: [
        `/resources/js/user/account/show-hide-password.js`,
        `/resources/js/user/account/login.js`,
      ],
      specificStylesheets: [
        `/resources/styles/common/views_default.css`,
        `/resources/styles/user/account/login.css`,
      ],
      currentPageSection: '',
    };
    return Object.assign(
      { layout: 'main' },
      { ...defaultHeader },
      defaultFooter,
      headInfo,
      {
        logoPath: 'resources/images/logo_current.png',
      },
    );
  }
}
