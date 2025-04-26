import { Controller } from '@nestjs/common';
import { LikeService } from './like.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController(true)
@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
}
