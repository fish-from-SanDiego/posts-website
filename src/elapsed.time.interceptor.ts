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
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const currentTimeStamp = Date.now();
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();
        const requestHandleTimeMs = Date.now() - currentTimeStamp;

        console.log(`${req.url} request: handled in ${requestHandleTimeMs} ms`);

        const isHtml = !req.path.startsWith('/api');
        console.log(req.originalUrl);
        if (isHtml) {
          return { ...data, requestHandleTimeMs: requestHandleTimeMs };
        }
        res.setHeader('X-Elapsed-Time', requestHandleTimeMs);
        return data;
      }),
    );
  }
}
