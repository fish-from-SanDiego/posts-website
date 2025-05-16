import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Render,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Prisma } from '@prisma/client';
import { Head } from '../templateModels/head.interface';
import defaultHeader from '../templateModels/header.default';
import defaultFooter from '../templateModels/footer.default';
import { CreatePostDto } from './dto/create-post.dto';
import { Response } from 'express';
import { notFound } from './exceptions';
import { ListPostsQueryDto } from './query/list-posts.query.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import {
  PublicAccess,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { SupertokensHtmlExceptionFilter } from '../auth/auth.filter';
import { Session } from '../auth/session/session.decorator';
import { SessionContainerInterface } from 'supertokens-node/lib/build/recipe/session/types';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { PostDto } from './response/post.dto';
import { PostHook } from './permissions/post.hook';
import { UpdatePostDto } from './dto/update-post.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiExcludeController(true)
@Controller('posts')
@UseFilters(SupertokensHtmlExceptionFilter)
@UseGuards(new SuperTokensAuthGuard())
@UseInterceptors(CacheInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @Render('post/list')
  @PublicAccess()
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
  @VerifySession()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, PostDto)
  goToPostCreation() {
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
    );
  }

  @Get(':id/edit')
  @Render('post/edit')
  @VerifySession()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, PostDto, PostHook)
  async goToPostEdition(@Param('id', ParseIntPipe) postId: number) {
    const where: Prisma.PostWhereUniqueInput = {
      id: postId,
    };
    const post = await this.postService.post(where);
    if (post == null) throw notFound();
    const headInfo: Head = {
      title: `Редактирование поста \\ ${post.title}`,
      description: `Редактирование поста`,
      keywords: 'Пост',
      specificScripts: [],
      specificModuleScripts: [],
      specificStylesheets: [`/resources/styles/post/edit.css`],
      currentPageSection: 'Посты',
    };
    return Object.assign(
      { layout: 'main' },
      { ...defaultHeader },
      defaultFooter,
      headInfo,
      {
        post: {
          id: post.id,
          categories: post.categories.map((cat) => cat.category),
          title: post.title,
          content: post.content,
        },
      },
    );
  }

  @Get(':id')
  @Render('post/info')
  @PublicAccess()
  async getPost(@Param('id', ParseIntPipe) postId: number) {
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
      specificModuleScripts: [
        '/resources/js/components/spinning_loader.js',
        '/resources/js/post/comments/create_comment.js',
        '/resources/js/post/comments/comments.js',
      ],
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
          updatedAt:
            post.updatedAt == post.createdAt ? post.updatedAt : undefined,
          categories: post.categories.map((cat) => cat.category),
          title: post.title,
          content: post.content,
        },
      },
    );
  }

  @Post()
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, PostDto)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Res() res: Response,
    @Session() session: SessionContainerInterface,
  ) {
    const newPost = await this.postService.createPost({
      ...createPostDto,
      authorId: session.getAccessTokenPayload().userId,
    });
    return res.redirect(`posts/${newPost.id}`);
  }

  @Patch(':id')
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, PostDto, PostHook)
  async updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @Res() res: Response,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    const updatedPost = await this.postService.updatePost({
      data: updatePostDto,
      where: { id: +postId },
    });
    return res.redirect(`posts/${updatedPost.id}`);
  }
}
