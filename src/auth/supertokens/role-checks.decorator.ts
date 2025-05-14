import { SetMetadata } from '@nestjs/common';
import { SessionRequest } from 'supertokens-node/framework/express';

export const ROLE_CHECKS_KEY = 'role_checks';
export type RoleCheck = (resourceOwnerId: number) => boolean;
export type GetOwnerIdFunction = (req: SessionRequest) => number;
export type RoleChecksMap = {
  [key: string]: RoleCheck;
};
export type RoleChecksOptions = {
  setupFunction: GetOwnerIdFunction;
  roleChecksMap: RoleChecksMap;
};
export const RoleChecks = (options: RoleChecksOptions) =>
  SetMetadata(ROLE_CHECKS_KEY, options);
