import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  content: string;

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  postId: number;

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  authorId: number;
}
