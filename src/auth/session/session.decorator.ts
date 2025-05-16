import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionRequest } from 'supertokens-node/framework/express';

export const Session = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<SessionRequest>();
    return request.session;
  },
);
