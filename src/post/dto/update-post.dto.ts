import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePostDto {
  @ApiProperty({
    example: 'Название поста',
    minLength: 5,
    maxLength: 100,
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  @MinLength(5)
  @MaxLength(100)
  title?: string;
  @ApiProperty({
    example: 'Контент поста',
    minLength: 5,
    maxLength: 20000,
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  @MinLength(5)
  @MaxLength(20000)
  content?: string;
}
