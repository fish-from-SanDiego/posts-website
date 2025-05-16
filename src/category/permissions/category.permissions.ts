import { InferSubjects } from '@casl/ability';
import { Actions, Permissions } from 'nest-casl';
import { Role } from '../../auth/supertokens/roles.dto';
import { CategoryDto } from '../responseData/categoryDto';

export type CategorySubjects = InferSubjects<typeof CategoryDto>;
export const categoryPermissions: Permissions<Role, CategorySubjects, Actions> =
  {
    everyone({ can }) {
      can(Actions.read, CategoryDto);
    },
    moderator({ can }) {
      can(Actions.delete, CategoryDto);
    },
  };
