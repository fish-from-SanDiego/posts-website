/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RoleChecks } from './role-checks.decorator';
import { SessionRequest } from 'supertokens-node/framework/express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roleChecksOptions = this.reflector.get(
      RoleChecks,
      context.getHandler(),
    );
    if (roleChecksOptions == null) return true;
    const ctx = context.switchToHttp();
    const req: SessionRequest = ctx.getRequest();
    const resourceData = await roleChecksOptions.setupFunction(req);
    const payload = req.session?.getAccessTokenPayload();
    if (payload == null) throw new ForbiddenException();
    const userRoles: string[] = payload['st-role'].v;
    const roleChecksMap = new Map(
      Object.entries(roleChecksOptions.roleChecksMap),
    );
    for (const role of userRoles) {
      const func = roleChecksMap.get(role);
      if (!func) continue;
      if (await func(req, resourceData)) return true;
    }
    throw new ForbiddenException();
  }
}
