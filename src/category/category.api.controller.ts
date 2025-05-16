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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryPageQuery } from './query/category.page.query';
import { Response } from 'express';
import { CategoryDto } from './responseData/categoryDto';
import { CategoryIdParam } from './query/category.id.param';
import { notFound } from './exceptions';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  PublicAccess,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { CategoryHook } from './permissions/category.hook';

@ApiTags('categories')
@Controller('api/categories')
@UseGuards(new SuperTokensAuthGuard())
export class CategoryApiController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Создание категории' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Успешное создание категории',
    type: CategoryDto,
  })
  @ApiConflictResponse({
    description: 'Категория с таким именем уже существует',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiCookieAuth()
  @Post()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, CategoryDto)
  @VerifySession({ options: { checkDatabase: true } })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Получение категорий на определённой странице',
  })
  @ApiOkResponse({
    description: 'Успешное получение категорий',
    type: CategoryDto,
    isArray: true,
    headers: {
      Link: {
        description: 'Header для пагинации',
        schema: {
          type: 'string',
          example: '<https://host.com/api/categories?page=2>; rel="next"',
        },
      },
    },
  })
  @PublicAccess()
  async findAll(@Query() query: CategoryPageQuery, @Res() res: Response) {
    const pageNumber = query.page;

    const { categories, total } =
      await this.categoryService.categories(pageNumber);

    const lastPage = Math.ceil(total / this.categoryService.pageSize);

    const baseUrl = `${res.req.protocol}://${res.req.get('host')}${res.req.baseUrl}/api/categories`;

    const links: string[] = [];

    if (pageNumber > 1) {
      links.push(
        `<${baseUrl}?page=${pageNumber - 1}&limit=${this.categoryService.pageSize}>; rel="prev"`,
      );
    }
    if (pageNumber < lastPage) {
      links.push(
        `<${baseUrl}?page=${pageNumber + 1}&limit=${this.categoryService.pageSize}>; rel="next"`,
      );
    }

    if (links.length > 0) {
      res.setHeader('Link', links.join(', '));
    }

    return res.json(categories);
  }

  @Get(':id')
  @PublicAccess()
  @ApiOperation({ summary: 'Получить категорию по id' })
  @ApiResponse({
    status: 200,
    description: 'Объект категории с id',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({ description: 'Категория не найдена' })
  async getOne(@Param() param: CategoryIdParam) {
    const res = await this.categoryService.category(param.id);
    if (res == null) throw notFound();
    return res;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновление значения имени для категории' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Категория успешно обновлена',
    type: CategoryDto,
  })
  @ApiConflictResponse({ description: 'Конфликт с существующим значением' })
  @ApiNotFoundResponse({ description: 'По id не найдено категории' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiCookieAuth()
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, CategoryDto, CategoryHook)
  async update(
    @Param() param: CategoryIdParam,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(param.id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление категории по id' })
  @ApiResponse({
    status: 200,
    description: 'Категория успешно удалена',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({ description: 'Категория с таким id не найдена' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiCookieAuth()
  @VerifySession({ options: { checkDatabase: true } })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, CategoryDto, CategoryHook)
  async remove(@Param() param: CategoryIdParam) {
    return this.categoryService.remove(param.id);
  }
}
