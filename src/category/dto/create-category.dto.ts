import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Коты', description: 'Название категории поста' })
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @Matches(/^[^\s.,;:!?(){}[\]<>/\\|'"~@#$%^&*+=]*$/, {
    message: 'Имя категории не должно содержать посторонних символов',
  })
  name: string;
}
