import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MethodOverrideMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const method = req.body?._method || req.query?._method;
    if (method && ['PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      req.method = method.toUpperCase(); // Override the HTTP method
      delete req  .body._method; // Clean up the body
    }
    next(); // Pass control to the next middleware or route handler
  }
}
