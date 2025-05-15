import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UserIdParam {
  @ApiProperty({
    example: 4444,
    description: 'id пользователя',
    minimum: 1,
    type: 'number',
  })
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  id: number;
}
