import { InferSubjects } from '@casl/ability';
import { Actions, Permissions } from 'nest-casl';
import { Role } from '../../auth/supertokens/roles.dto';
import { CommentDto } from '../dto/comment.dto';

export type CommentSubjects = InferSubjects<typeof CommentDto>;
export const commentPermissions: Permissions<Role, CommentSubjects, Actions> = {
  everyone({ can, user }) {
    can(Actions.read, CommentDto);
    can(Actions.create, CommentDto);
    can(Actions.delete, CommentDto, { authorId: user.id });
    can(Actions.update, CommentDto, { authorId: user.id });
  },
  moderator({ can }) {
    can(Actions.delete, CommentDto);
  },
};
