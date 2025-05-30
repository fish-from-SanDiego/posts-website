import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { notFound } from './exceptions';
import { CreatePostDto } from './dto/create-post.dto';
import { Response } from 'express';
import { ListPostsFullQueryDto } from './query/list-posts.full.query.dto';
import { PostDto } from './response/post.dto';
import { PostIdParam } from './query/post-id.param';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  PublicAccess,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { PostHook } from './permissions/post.hook';
import { Session } from '../auth/session/session.decorator';
import { SessionContainerInterface } from 'supertokens-node/lib/build/recipe/session/types';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('posts')
@Controller('api/posts')
@UseGuards(new SuperTokensAuthGuard())
@UseInterceptors(CacheInterceptor)
export class PostApiController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ description: 'Получение постов по категориям и странице' })
  @ApiOkResponse({
    description: 'Успешное получение постов',
    type: PostDto,
    isArray: true,
    headers: {
      Link: {
        description: 'Header для пагинации',
        schema: {
          type: 'string',
          example: '<https://host.com/api/posts?page=2>; rel="next"',
        },
      },
    },
  })
  @Get()
  @PublicAccess()
  async listPosts(@Query() query: ListPostsFullQueryDto, @Res() res: Response) {
    const pageNumber = query.page ? query.page : 1;

    const { posts, total } = await this.postService.postsByCategories(
      pageNumber,
      query.categoryNames,
    );

    const lastPage = Math.ceil(total / this.postService.pageSize);

    const baseUrl =
      query.categoryNames && query.categoryNames.length > 0
        ? `${res.req.protocol}://${res.req.get('host')}${res.req.baseUrl}/api/posts?categoryNames=${query.categoryNames.join(',')}&`
        : `${res.req.protocol}://${res.req.get('host')}${res.req.baseUrl}/api/posts?`;

    const links: string[] = [];

    if (pageNumber > 1) {
      links.push(
        `<${baseUrl}page=${pageNumber - 1}&limit=${this.postService.pageSize}>; rel="prev"`,
      );
    }
    if (pageNumber < lastPage) {
      links.push(
        `<${baseUrl}page=${pageNumber + 1}&limit=${this.postService.pageSize}>; rel="next"`,
      );
    }

    if (links.length > 0) {
      res.setHeader('Link', links.join(', '));
    }

    return res.json(posts);
  }

  @ApiOperation({ summary: 'Создание поста' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    description: 'Успешное создание поста',
    type: PostDto,
  })
  @ApiNotFoundResponse({
    description: 'Автора поста не существует',
  })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @ApiForbiddenResponse({ description: 'Не разрешено' })
  @ApiCookieAuth()
  @Post()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, PostDto)
  @VerifySession({ options: { checkDatabase: true } })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Session() session: SessionContainerInterface,
  ) {
    return await this.postService.createPost({
      ...createPostDto,
      authorId: session.getAccessTokenPayload().userId,
    });
  }

  @ApiOperation({ summary: 'Получение поста по id' })
  @ApiOkResponse({
    description: 'Успешное получение поста',
    type: PostDto,
  })
  @ApiNotFoundResponse({
    description: 'Пост по id не найден',
  })
  @Get(':id')
  @PublicAccess()
  async getPost(@Param() param: PostIdParam) {
    const where: Prisma.PostWhereUniqueInput = {
      id: param.id,
    };
    const res = await this.postService.post(where);
    if (res == null) throw notFound();
    return res;
  }

  @ApiOperation({ summary: 'Обновление поста по id' })
  @ApiOkResponse({
    description: 'Успешное обновление поста',
    type: PostDto,
  })
  @ApiNotFoundResponse({
    description: 'Пост по id не найден',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBody({ type: UpdatePostDto })
  @ApiCookieAuth()
  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, PostDto, PostHook)
  @VerifySession({ options: { checkDatabase: true } })
  async updatePost(
    @Param() param: PostIdParam,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost({
      where: { id: param.id },
      data: updatePostDto,
    });
  }

  @ApiOperation({ summary: 'Удаление поста по id' })
  @ApiOkResponse({
    description: 'Успешное удаление поста',
    type: PostDto,
  })
  @ApiNotFoundResponse({
    description: 'Пост по id не найден',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiCookieAuth()
  @Delete(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, PostDto, PostHook)
  @VerifySession({ options: { checkDatabase: true } })
  async removePost(@Param() param: PostIdParam) {
    return this.postService.deletePost({ id: param.id });
  }
}
