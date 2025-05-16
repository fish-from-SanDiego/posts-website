import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { errorHandler } from 'supertokens-node/framework/express';
import { Error as STError } from 'supertokens-node';

@Catch(STError)
export class SupertokensHtmlExceptionFilter implements ExceptionFilter {
  handler: ErrorRequestHandler;

  constructor() {
    this.handler = errorHandler();
  }

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    if (
      exception.type === 'UNAUTHORISED' ||
      exception.type === 'TRY_REFRESH_TOKEN'
    ) {
      res.redirect('/login');
    } else {
      await this.handler(exception, req, res, ctx.getNext<NextFunction>());
    }
  }
}
