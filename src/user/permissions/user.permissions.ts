import { InferSubjects } from '@casl/ability';
import { Actions, Permissions } from 'nest-casl';
import { Role } from '../../auth/supertokens/roles.dto';
import { UserDto } from '../dto/user.dto';

export type UserSubjects = InferSubjects<typeof UserDto>;
export const userPermissions: Permissions<Role, UserSubjects, Actions> = {
  everyone({ can, user }) {
    can(Actions.read, UserDto);
    can(Actions.delete, UserDto, { id: user.id });
    can(Actions.update, UserDto, { id: user.id });
  },
};
