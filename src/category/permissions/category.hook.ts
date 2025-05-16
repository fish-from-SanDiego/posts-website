import { BadRequestException, Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { CurrentUserRequest } from '../../auth/session/session.payload.middleware';
import { CategoryDto } from '../responseData/categoryDto';
import { CategoryService } from '../category.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoryHook
  implements SubjectBeforeFilterHook<CategoryDto, CurrentUserRequest>
{
  constructor(private readonly categoryService: CategoryService) {}

  async run(request: CurrentUserRequest) {
    let id: number;
    try {
      id = parseInt(request.params.id);
    } catch (e) {
      throw new BadRequestException();
    }
    const category: CategoryDto = await this.categoryService.getCategory(id);
    return plainToInstance(CategoryDto, category);
  }
}
