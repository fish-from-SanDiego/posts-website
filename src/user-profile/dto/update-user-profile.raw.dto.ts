import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserProfileRawDto {
  @ApiProperty({
    example: 'Здесь я буду вести блог о...',
    minLength: 1,
    maxLength: 1000,
    required: false,
    type: 'string',
  })
  @IsOptional()
  @MaxLength(1000)
  @MinLength(1)
  bio?: string;

  @ApiProperty({
    example: 'Статус.',
    minLength: 1,
    maxLength: 40,
    required: false,
    type: 'string',
  })
  @IsOptional()
  @Type(() => String)
  @MinLength(1)
  @MaxLength(40)
  status?: string;

  @ApiProperty({
    example: '/users/2/pic.png',
    required: false,
    type: 'string',
  })
  @IsUrl()
  @IsOptional()
  @Type(() => String)
  pictureUrl?: string;
}
