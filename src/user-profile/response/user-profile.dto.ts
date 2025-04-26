import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/response/user.dto';

export class UserProfileDto {
  @ApiProperty({ example: 'Описание' })
  bio?: string;
  @ApiProperty({ example: 'Крутой статус' })
  status?: string;
  @ApiProperty()
  user: UserDto;
}
