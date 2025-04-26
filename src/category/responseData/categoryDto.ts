import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Коты' })
  name: string;
}
