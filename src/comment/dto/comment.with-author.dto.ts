import { UserDto } from '../../user/dto/user.dto';
import { CommentDto } from './comment.dto';

export class CommentWithAuthorDto extends CommentDto{
  author: UserDto | null;
}
