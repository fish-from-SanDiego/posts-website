import { Injectable, NestMiddleware } from '@nestjs/common';
import { middleware as expressMiddleware } from 'supertokens-node/framework/express';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  supertokensMiddleware: any;

  constructor() {
    this.supertokensMiddleware = expressMiddleware();
  }

  use(req: Request, res: Response, next: () => void) {
    console.log('middleware');
    return this.supertokensMiddleware(req, res, next);
  }
}
