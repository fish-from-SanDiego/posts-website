/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request, Response } from 'express';
import * as crypto from 'node:crypto';

@Injectable()
export class ClientCacheInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    if (context.getType() !== 'http') {
      return next.handle();
    }
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const isHtml = !req.path.startsWith('/api');
    if (req.method !== 'GET' || isHtml) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        if (!data) return data;
        const etag = crypto
          .createHash('md5')
          .update(JSON.stringify(data))
          .digest('hex');
        if (!res.headersSent) {
          res.setHeader('ETag', `"${etag}"`);
          res.setHeader('Cache-Control', 'public, max-age=10');
        }
        const valFromClient = req.get('If-None-Match');
        console.log('if', valFromClient);
        if (valFromClient === `"${etag}"`) {
          res.status(304);
          return null;
        }
        return data;
      }),
    );
  }
}
