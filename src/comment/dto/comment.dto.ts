import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  content: string;

  postId: number;

  authorId: number | null;

  id: number;

  @ApiProperty({
    example: '2025-04-25T23:08:23.000Z',
  })
  createdAt: Date;
}
