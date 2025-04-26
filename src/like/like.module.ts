import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [LikeService],
})
export class LikeModule {}
