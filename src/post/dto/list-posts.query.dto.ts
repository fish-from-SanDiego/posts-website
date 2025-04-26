﻿import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListPostsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
}
