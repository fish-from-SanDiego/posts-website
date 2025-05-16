import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryApiController } from './category.api.controller';
import { CaslModule } from 'nest-casl';
import { categoryPermissions } from './permissions/category.permissions';

@Module({
  imports: [
    PrismaModule,
    CaslModule.forFeature({ permissions: categoryPermissions }),
  ],
  controllers: [CategoryApiController],
  providers: [CategoryService],
})
export class CategoryModule {}
