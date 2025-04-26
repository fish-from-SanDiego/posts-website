import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryPageQuery {
  @ApiProperty({
    example: '2',
    description: 'Страница категорий',
    required: false,
    type: 'number',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number = 1;
}
