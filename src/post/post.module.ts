import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PostApiController } from './post.api.controller';
import { CaslModule } from 'nest-casl';
import { postPermissions } from './permissions/post.permissions';

@Module({
  imports: [
    PrismaModule,
    CaslModule.forFeature({ permissions: postPermissions }),
  ],
  controllers: [PostController, PostApiController],
  providers: [PostService],
})
export class PostModule {}
