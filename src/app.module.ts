import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { CategoryModule } from './category/category.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.app.env'],
      load: [appConfig],
    }),
    PrismaModule,
    UserModule,
    PostModule,
    UserProfileModule,
    CategoryModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
