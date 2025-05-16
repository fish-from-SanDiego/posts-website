import { AuthorizableUser } from 'nest-casl';

export enum Role {
  User = 'user',
  Moderator = 'moderator',
  Admin = 'admin',
}

export class AuthUser implements AuthorizableUser<Role, number> {
  id: number;
  roles: Array<Role>;
}
