import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PostIdParam {
  @ApiProperty({
    example: 1,
    description: 'id поста',
    minimum: 1,
    type: 'number',
  })
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  id: number;
}
