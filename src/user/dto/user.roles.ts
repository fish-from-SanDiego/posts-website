import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/supertokens/roles.dto';
import { IsArray, IsEnum } from 'class-validator';

export class UserRolesDto {
  @ApiProperty({
    type: [String],
    enum: Role,
    isArray: true,
    description: 'Список ролей пользователя',
    example: [Role.Moderator],
  })
  @IsArray()
  @IsEnum(Role, {
    each: true,
    message: 'Каждая роль должна быть одной из: user, moderator, admin',
  })
  roles: Role[];
}
