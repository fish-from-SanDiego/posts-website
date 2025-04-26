import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('categories')
@Controller('api/categories')
export class CategoryApiController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Создание категории' })
  @ApiResponse({ status: 200, description: 'Category created successfully' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories with pagination and HATEOAS links',
  })
  @ApiResponse({ status: 200, description: 'List of categories' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Res() res: Response,
  ) {
    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10))); // ограничение лимита

    const { categories, total } = await this.categoryService.findAll(
      pageNumber,
      limitNumber,
    );

    const lastPage = Math.ceil(total / limitNumber);

    const baseUrl = `${res.req.protocol}://${res.req.get('host')}${res.req.baseUrl}/categories`;

    const links = [];

    if (pageNumber > 1) {
      links.push(
        `<${baseUrl}?page=${pageNumber - 1}&limit=${limitNumber}>; rel="prev"`,
      );
    }
    if (pageNumber < lastPage) {
      links.push(
        `<${baseUrl}?page=${pageNumber + 1}&limit=${limitNumber}>; rel="next"`,
      );
    }

    if (links.length > 0) {
      res.setHeader('Link', links.join(', '));
    }

    return res.json({
      data: categories,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        lastPage,
      },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, description: 'Category details' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category by id' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by id' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
