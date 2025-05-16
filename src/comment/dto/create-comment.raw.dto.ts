import { CreateCommentDto } from './create-comment.dto';

export class CreateCommentRawDto extends CreateCommentDto {
  authorId: number;
}
