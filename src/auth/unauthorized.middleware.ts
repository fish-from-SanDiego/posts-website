import { Injectable, NestMiddleware } from '@nestjs/common';
import { SessionRequest } from 'supertokens-node/framework/express';
import { getSession } from 'supertokens-node/recipe/session';
import { Error as STError } from 'supertokens-node';
import { Response } from 'express';

@Injectable()
export class UnauthorizedMiddleware implements NestMiddleware {
  async use(req: SessionRequest, res: Response, next: (error?: any) => void) {
    try {
      await getSession(req, res, {
        sessionRequired: true,
        antiCsrfCheck: false,
        checkDatabase: true,
      });
    } catch (error) {
      console.log(error.type);
      if (error instanceof STError && error.type === 'UNAUTHORISED') {
        res.redirect('/auth');
        // return;
      }
    }
    next();
  }
}
