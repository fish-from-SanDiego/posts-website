import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/response/user.dto';
import { PostsCategoriesDto } from '../query/posts.categories.dto';

export class PostDto {
  @ApiProperty({ example: 1, description: 'ID поста' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID автора' })
  authorId?: number;

  @ApiProperty({ example: 'Пост', description: 'Заголовок поста' })
  title: string;

  @ApiProperty({
    example: 'Крутой пост Крутой пост...',
    description: 'Контент поста',
  })
  content: string;

  @ApiProperty({
    example: '1',
    description: 'Число лайков',
  })
  likesCount: number;

  @ApiProperty({
    example: '2025-04-25T23:08:23.000Z',
    description: 'Дата создания поста',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-04-25T23:12:25.000Z',
    description: 'Дата обновления поста',
  })
  updatedAt?: Date;

  @ApiProperty()
  author?: UserDto;

  @ApiProperty({ type: PostsCategoriesDto, isArray: true })
  categories: PostsCategoriesDto[];
}
