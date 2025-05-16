import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CaslModule } from 'nest-casl';
import { commentPermissions } from './permissions/comment.permissions';

@Module({
  imports: [
    PrismaModule,
    CaslModule.forFeature({ permissions: commentPermissions }),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
