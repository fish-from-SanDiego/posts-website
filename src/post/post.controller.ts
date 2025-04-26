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
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Prisma } from '@prisma/client';
import { Head } from '../templateModels/head.interface';
import defaultHeader from '../templateModels/header.default';
import defaultFooter from '../templateModels/footer.default';
import { CreatePostDto } from './dto/create-post.dto';
import { Response } from 'express';
import { notFound } from './exceptions';
import { ListPostsQueryDto } from './dto/list-posts.query.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController(true)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @Render('post/list')
  async listPosts(@Query() query: ListPostsQueryDto) {
    const pageN = query.page ? query.page : 1;
    const posts = await this.postService.postsPaged(pageN);
    const pageNumber = posts.pageNumber;
    const headInfo: Head = {
      title: `Посты: страница ${pageNumber}`,
      description: `Посты`,
      keywords: 'Пост',
      specificScripts: [],
      specificModuleScripts: [],
      specificStylesheets: [`/resources/styles/post/list.css`],
      currentPageSection: 'Посты',
    };
    return Object.assign(
      { layout: 'main' },
      { ...defaultHeader },
      defaultFooter,
      headInfo,
      {
        posts: posts.data,
        prevPage: pageNumber > 1 ? pageNumber - 1 : undefined,
        nextPage:
          pageNumber * posts.pageSize >= posts.postsCount
            ? undefined
            : pageNumber + 1,
        pageNumber: pageNumber,
      },
    );
  }

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
    @Param('postId', ParseIntPipe) postId: number,
    @Query('loggedId') loggedId?: number,
  ) {
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
