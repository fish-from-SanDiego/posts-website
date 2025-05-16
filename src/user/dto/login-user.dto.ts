import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email или username пользователя',
    type: 'string',
  })
  @IsString()
  @Type(() => String)
  emailOrUsername: string;

  @ApiProperty({
    example: '123Pas456wo@rdDD56',
    description: 'Пароль пользователя',
    type: 'string',
  })
  @IsString()
  @Type(() => String)
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Пароль недостаточно сложный',
    },
  )
  password: string;
}
