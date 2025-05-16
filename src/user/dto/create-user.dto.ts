import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotIn,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    example: 'user',
    description: 'Имя пользователя',
    minLength: 3,
    maxLength: 20,
    type: 'string',
    format: '/^[a-zA-Z0-9]+$/',
  })
  @IsString()
  @Type(() => String)
  @MinLength(3)
  @MaxLength(20)
  @IsNotIn(['[удалён]'], {
    message: 'Имя пользователя в списке зарезервированных',
  })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Имя пользователя не должно содержать посторонних символов',
  })
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
    type: 'string',
  })
  @IsString()
  @Type(() => String)
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

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
