import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import { ConfigNamespaces } from './config/config.namespaces';
import { AppConfig } from './config/app.config.type';
import { getSuperTokensConfig } from './auth/auth.config';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.app.env'],
      load: [appConfig],
    }),
    AuthModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigNamespaces>) => {
        const appConfig = configService.getOrThrow<AppConfig>('app');
        const superTokensConfig = getSuperTokensConfig(appConfig);
        return {
          connectionURI:
            superTokensConfig.supertokens?.connectionURI ??
            appConfig.superTokensConnectionUrl,
          apiKey: appConfig.superTokensApiKey,
          appInfo: superTokensConfig.appInfo,
          recipeList: superTokensConfig.recipeList,
        };
      },
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.app.env'],
          load: [appConfig],
        }),
      ],
    }),
    PrismaModule,
    UserModule,
    PostModule,
    UserProfileModule,
    CategoryModule,
    CommentModule,
    LikeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
