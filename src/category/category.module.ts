import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryApiController } from './category.api.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryApiController],
  providers: [CategoryService],
})
export class CategoryModule {}
