import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PostApiController } from './post.api.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PostController, PostApiController],
  providers: [PostService],
})
export class PostModule {}
