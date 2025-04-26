import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Head } from './templateModels/head.interface';
import defaultHeader from './templateModels/header.default';
import defaultFooter from './templateModels/footer.default';

@Catch()
export class GlobalFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const accept = request.headers['accept'];

    const isHtml = accept && accept.includes('text/html');
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';
    console.log(exception);
    if (isHtml) {
      const headInfo: Head = {
        title: 'Ошибка',
        description: 'Ошибка',
        keywords: 'Сайт',
        specificScripts: [],
        specificModuleScripts: [],
        specificStylesheets: ['/resources/styles/error.css'],
        currentPageSection: '',
      };
      const model = Object.assign(
        { layout: 'main' },
        { ...defaultHeader, userLoggedIn: false },
        defaultFooter,
        headInfo,
        {
          errorMessage: message,
        },
      );
      response.status(status).render('error', model);
    } else {
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    }
  }
}
