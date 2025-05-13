import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { errorHandler } from 'supertokens-node/framework/express';
import { Error as STError } from 'supertokens-node';
import SuperTokensError from 'supertokens-node/lib/build/error';

@Catch(STError)
export class SupertokensHtmlExceptionFilter
  implements ExceptionFilter<SuperTokensError>
{
  handler: ErrorRequestHandler;

  constructor() {
    this.handler = errorHandler();
  }

  async catch(exception: SuperTokensError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    if (exception.type === 'UNAUTHORISED') {
      res.redirect('/auth');
    } else if (exception.type === 'TRY_REFRESH_TOKEN') {
      res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: res.statusCode,
        message: 'try refresh token',
        timestamp: new Date().toISOString(),
      });
    } else {
      await this.handler(exception, req, res, ctx.getNext<NextFunction>());
    }
  }
}
