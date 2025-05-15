import { SessionRequest } from 'supertokens-node/framework/express';
import { Reflector } from '@nestjs/core';

export type RoleCheck = (
  req: SessionRequest,
  resourceData: any,
) => boolean | Promise<boolean>;
export type GetResourceDataFunction = (req: SessionRequest) => any;
export type RoleChecksMap = {
  [key: string]: RoleCheck;
};
export type RoleChecksOptions = {
  setupFunction: GetResourceDataFunction;
  roleChecksMap: RoleChecksMap;
};
export const RoleChecks = Reflector.createDecorator<RoleChecksOptions>();
