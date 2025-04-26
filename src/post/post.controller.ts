import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Render,
  Query,
  Res,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Prisma } from '@prisma/client';
import { Head } from '../templateModels/head.interface';
import defaultHeader from '../templateModels/header.default';
import defaultFooter from '../templateModels/footer.default';
import { CreatePostDto } from './dto/create-post.dto';
import { Response } from 'express';
import { notFound } from './exceptions';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @Get()
  // @Render('post/list')
  // listPosts(@Query())

  @Get('new')
  @Render('post/new')
  goToPostCreation(@Query('loggedId') loggedId: number) {
    const authorId = Number(loggedId);
    const headInfo: Head = {
      title: 'Создание поста',
      description: `Создание поста`,
      keywords: 'Пост',
      specificScripts: [],
      specificModuleScripts: [],
      specificStylesheets: [`/resources/styles/post/new.css`],
      currentPageSection: 'Посты',
    };
    return Object.assign(
      { layout: 'main' },
      { ...defaultHeader },
      defaultFooter,
      headInfo,
      {
        authorId: authorId,
      },
    );
  }

  @Get(':postId')
  @Render('post/info')
  async getPost(
    @Param('postId') id: string,
    @Query('loggedId') loggedId?: number,
  ) {
    const postId = Number(id);
    const where: Prisma.PostWhereUniqueInput = {
      id: postId,
    };
    const post = await this.postService.post(where);
    if (post == null) throw notFound();
    const author = post.author;
    const headInfo: Head = {
      title: post.title,
      description: `Пост ${post.title}`,
      keywords: 'Пост',
      specificScripts: [],
      specificModuleScripts: ['/resources/js/components/spinning_loader.js'],
      specificStylesheets: [
        `/resources/styles/post/info.css`,
        `/resources/styles/common/views_default.css`,
      ],
      currentPageSection: 'Посты',
    };
    return Object.assign(
      { layout: 'main' },
      { ...defaultHeader },
      defaultFooter,
      headInfo,
      {
        author: author,
        post: {
          id: post.id,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          categories: post.categories.map((cat) => cat.category),
          title: post.title,
          content: post.content,
        },
        loggedId: loggedId,
      },
    );
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @Res() res: Response) {
    const newPost = await this.postService.createPost(createPostDto);
    return res.redirect(
      `posts/${newPost.id}?loggedId=${createPostDto.authorId}`,
    );
  }
}
