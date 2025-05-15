/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Session from 'supertokens-node/recipe/session';

type CurrentUser = {
  username: string;
  id: number;
};

@Injectable()
export class SessionPayloadMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: () => void) {
    try {
      const session = await Session.getSession(req, res, {
        sessionRequired: false,
        antiCsrfCheck: false,
      });
      if (session == null) res.locals.currentUser = null;
      else {
        const payload = session.getAccessTokenPayload();
        console.log(payload);
        res.locals.currentUser = {
          username: payload.username,
          id: payload.userId,
          roles: payload['st-role'].v,
        };
      }
    } catch (e) {
      res.locals.currentUser = null;
    }
    next();
  }
}
