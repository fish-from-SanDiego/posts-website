import { BadRequestException, Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { CurrentUserRequest } from '../../auth/session/session.payload.middleware';
import { CommentDto } from '../dto/comment.dto';
import { CommentService } from '../comment.service';
import { plainToInstance } from 'class-transformer';
import { PostDto } from '../../post/response/post.dto';

@Injectable()
export class CommentHook
  implements SubjectBeforeFilterHook<CommentDto, CurrentUserRequest>
{
  constructor(private readonly commentService: CommentService) {}

  async run(request: CurrentUserRequest) {
    let id: number;
    try {
      id = parseInt(request.params.id);
    } catch (e) {
      throw new BadRequestException();
    }
    const comment: CommentDto = await this.commentService.getCommentById(id);
    return plainToInstance(CommentDto, comment);
  }
}
