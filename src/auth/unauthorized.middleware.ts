import { Injectable, NestMiddleware } from '@nestjs/common';
import { SessionRequest } from 'supertokens-node/framework/express';
import { getSession } from 'supertokens-node/recipe/session';
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
      if (error.type === 'UNAUTHORISED') {
        res.redirect('/auth');
        // return;
      }
    }
    next();
  }
}
