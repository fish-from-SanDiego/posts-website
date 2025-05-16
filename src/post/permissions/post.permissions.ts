import { InferSubjects } from '@casl/ability';
import { PostDto } from '../response/post.dto';
import { AuthUser, Role } from '../../auth/supertokens/roles.dto';
import { Actions, Permissions } from 'nest-casl';

export type PostSubjects = InferSubjects<typeof PostDto>;
export const postPermissions: Permissions<Role, PostSubjects, Actions> = {
  every({ user, can }) {
    can(Actions.read, PostDto);
    can(Actions.create, PostDto);
    can(Actions.delete, PostDto, { authorId: user.id });
    can(Actions.update, PostDto, { authorId: user.id });
  },
  moderator({ can }) {
    can(Actions.delete, PostDto);
  },
};
