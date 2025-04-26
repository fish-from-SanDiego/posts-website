import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({
    example: 'Название поста',
    minLength: 5,
    maxLength: 100,
    required: true,
    type: 'string',
  })
  @IsString()
  @Type(() => String)
  @MinLength(5)
  @MaxLength(100)
  title: string;
  @ApiProperty({
    example: 'Контент поста',
    minLength: 5,
    maxLength: 20000,
    required: true,
    type: 'string',
  })
  @IsString()
  @Type(() => String)
  @MinLength(5)
  @MaxLength(20000)
  content: string;

  @ApiProperty({
    example: '1',
    required: true,
    type: 'number',
    minimum: 1,
  })
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  authorId: number;

  @IsArray()
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
  categoryNames: string[];
}
