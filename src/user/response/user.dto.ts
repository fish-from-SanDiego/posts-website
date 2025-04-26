import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '1' })
  id: number;
  @ApiProperty({ example: 'user' })
  username: string;
  @ApiProperty({ example: '/users/2/pic.png' })
  pictureUrl?: string;
}
