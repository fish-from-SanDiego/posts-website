import { IsInt, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyTrimmed } from '../../decorators/is-not-empty-trimmed.decorator';

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmptyTrimmed()
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
