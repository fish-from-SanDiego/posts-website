import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  minLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Коты',
    description: 'Название категории поста',
    minLength: 2,
    maxLength: 15,
    type: 'string',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  name: string;
}
