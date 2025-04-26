import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotIn,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserUsernameParam {
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
  @IsNotIn(['[удалён]'])
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Имя пользователя не должно содержать посторонних символов',
  })
  username: string;
}
