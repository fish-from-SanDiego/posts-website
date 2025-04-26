import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller()
export class CategoryApiController {
  constructor(private categoryService: CategoryService) {}
}
