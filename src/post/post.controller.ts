import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Prisma } from '@prisma/client';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:postId')
  async getPost(@Param() id: string) {
    const include: Prisma.PostInclude = {
      author: true,
      categories: true,
      comments: false,
      likes: false,
    };
    const postId = Number(id);
    const where: Prisma.PostWhereUniqueInput = {
      id: postId,
    };
    const post = await this.postService.post(where, include);
    if (post == null)
      throw new NotFoundException("Can't find the post with that id");
  }
}
