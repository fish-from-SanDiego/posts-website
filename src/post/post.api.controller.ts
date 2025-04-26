import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Head } from '../templateModels/head.interface';
import defaultHeader from '../templateModels/header.default';
import defaultFooter from '../templateModels/footer.default';
import { Prisma } from '@prisma/client';
import { notFound } from './exceptions';
import { CreatePostDto } from './dto/create-post.dto';
import { Response } from 'express';
import { ListPostsFullQueryDto } from './query/list-posts.full.query.dto';
import { CategoryDto } from '../category/responseData/categoryDto';
import { PostDto } from './response/PostDto';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import { PostIdParam } from './query/post-id.param';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('posts')
@Controller('api/posts')
export class PostApiController {
  constructor(private readonly postService: PostService) {}

  @Get()
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
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
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
  async getPost(@Param() param: PostIdParam) {
    const where: Prisma.PostWhereUniqueInput = {
      id: param.id,
    };
    const res = this.postService.post(where);
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
  @ApiBody({ type: UpdatePostDto })
  @Patch(':id')
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
  @Delete(':id')
  async removePost(@Param() param: PostIdParam) {
    return this.postService.deletePost({ id: param.id });
  }
}
