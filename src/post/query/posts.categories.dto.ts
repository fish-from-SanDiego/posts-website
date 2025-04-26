import { ApiProperty } from '@nestjs/swagger';

export class PostsCategoriesDto {
  @ApiProperty({ example: 1 })
  postId: number;

  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty({ example: { id: 1, name: 'ddd' } })
  category: {
    id: number;
    name: string;
  };
}
