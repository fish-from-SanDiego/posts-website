import { Controller } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('api/posts')
export class PostApiController {
  constructor(private readonly postService: PostService) {}
}
