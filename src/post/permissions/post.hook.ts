import { BadRequestException, Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { PostDto } from '../response/post.dto';
import { CurrentUserRequest } from '../../auth/session/session.payload.middleware';
import { PostService } from '../post.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostHook
  implements SubjectBeforeFilterHook<PostDto, CurrentUserRequest>
{
  constructor(private readonly postService: PostService) {}

  async run(request: CurrentUserRequest) {
    let id: number;
    try {
      id = parseInt(request.params.id);
    } catch (e) {
      throw new BadRequestException();
    }

    const post = await this.postService.getPost({
      id: id,
    });
    return plainToInstance(PostDto, post);
  }
}
