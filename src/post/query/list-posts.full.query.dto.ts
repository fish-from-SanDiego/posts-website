import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListPostsFullQueryDto {
  @ApiProperty({
    example: '2',
    description: 'Страница постов',
    required: false,
    type: 'number',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    example: ['ааа'],
    description: 'Имена категорий',
    required: false,
    type: 'string',
    isArray: true,
  })
  @ArrayMinSize(1)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryNames?: string[];
}
