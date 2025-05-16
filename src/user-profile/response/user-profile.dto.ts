import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';

export class UserProfileDto {
  @ApiProperty({ example: 'Описание' })
  bio: string | null;
  @ApiProperty({ example: 'Крутой статус' })
  status: string | null;
  @ApiProperty()
  user: UserDto;
  @ApiProperty({ example: 1 })
  userId: number;
}
