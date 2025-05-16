import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePostDto } from './create-post.dto';

export class CreatePostRawDto extends CreatePostDto {
  // @ApiProperty({
  //   example: 1,
  //   required: true,
  //   type: 'number',
  //   minimum: 1,
  // })
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  authorId: number;
}
