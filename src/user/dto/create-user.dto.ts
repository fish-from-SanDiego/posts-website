import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNotIn,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
  ValidationArguments,
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
      message: (args: ValidationArguments) => {
        const [minLength, minLowercase, minUppercase, minNumbers, minSymbols] =
          args.constraints;
        return `Пароль должен содержать минимум ${minLength} символов, включая хотя бы ${minLowercase} строчных букв, ${minUppercase} заглавных букв, ${minNumbers} цифр и ${minSymbols} специальных символов`;
      },
    },
  )
  password: string;
}
