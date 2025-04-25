import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { UsernameIsBusyException } from './username-is-busy.exception';

@Catch()
export class UserExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const status = this.getStatus(exception);

    const message = this.getMessage(exception);

    const responseBody = {
      statusCode: status,
      message: message,
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) return exception.getStatus();
    if (exception instanceof UsernameIsBusyException)
      return HttpStatus.CONFLICT;
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown): string | object {
    if (exception instanceof HttpException) return exception.getResponse();
    if (exception instanceof UsernameIsBusyException)
      return 'A user with that username already exists';
    return 'Internal server error';
  }
}
