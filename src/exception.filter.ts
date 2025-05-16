/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Head } from './templateModels/head.interface';
import defaultHeader from './templateModels/header.default';
import defaultFooter from './templateModels/footer.default';

@Catch()
export class GlobalFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isHtml = !request.path.startsWith('/api');
    console.log(isHtml);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception.type != null &&
            (exception.type === 'UNAUTHORISED' ||
              exception.type === 'TRY_REFRESH_TOKEN')
          ? HttpStatus.UNAUTHORIZED
          : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : exception.type != null &&
            (exception.type === 'UNAUTHORISED' ||
              exception.type === 'TRY_REFRESH_TOKEN')
          ? 'Unauthorized; try login'
          : 'Internal Server Error';
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
        { ...defaultHeader },
        defaultFooter,
        headInfo,
        {
          errorMessage: exception.response?.message ?? message,
        },
      );
      response.status(status).render('error', model);
    } else {
      response.status(status).json({
        statusCode: status,
        message: exception.response?.message ?? message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
