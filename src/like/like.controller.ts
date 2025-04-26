import { Controller } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
}
