import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
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
    example: ['Коты', 'Ещё что-нибудь'],
    description: 'Название категории поста',
    minLength: 2,
    maxLength: 15,
    type: 'string',
  })
  @IsArray()
  @IsString({ each: true })
  @MinLength(2, { each: true })
  @MaxLength(15, { each: true })
  @IsOptional()
  categoryNames?: string[];
}
