import { InferSubjects } from '@casl/ability';
import { UserDto } from '../../user/dto/user.dto';
import { Actions, Permissions } from 'nest-casl';
import { Role } from '../../auth/supertokens/roles.dto';
import { UserProfileDto } from '../response/user-profile.dto';

export type UserProfileSubjects = InferSubjects<typeof UserProfileDto>;
export const userProfilePermissions: Permissions<
  Role,
  UserProfileSubjects,
  Actions
> = {
  everyone({ can, user }) {
    can(Actions.read, UserProfileDto);
    can(Actions.manage, UserProfileDto, { userId: user.id });
  },
};
