import { Module } from '@nestjs/common';
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
import adminConfig from './config/admin.config';
import { CaslModule } from 'nest-casl';
import { AuthUser, Role } from './auth/supertokens/roles.dto';
import { CurrentUserRequest } from './auth/session/session.payload.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.app.env'],
      load: [appConfig, adminConfig],
      isGlobal: true,
    }),
    AuthModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigNamespaces>) => {
        const appConfig = configService.getOrThrow<AppConfig>('app');
        const superTokensConfig = getSuperTokensConfig(appConfig);
        return {
          connectionURI:
            superTokensConfig.connectionURI ??
            appConfig.superTokensConnectionUrl,
          apiKey: appConfig.superTokensApiKey,
          appInfo: superTokensConfig.appInfo,
        };
      },
      imports: [],
    }),
    CaslModule.forRoot<Role, AuthUser, CurrentUserRequest>({
      superuserRole: Role.Admin,
      getUserFromRequest: (request) => {
        const payload = request.session!.getAccessTokenPayload();
        const roles: string[] = payload['st-role'].v;
        return {
          id: +payload.userId,
          roles: roles.filter((str): str is Role =>
            Object.values(Role).includes(str as Role),
          ),
        };
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 10000,
    }),
    PrismaModule,
    UserModule,
    PostModule,
    UserProfileModule,
    CategoryModule,
    CommentModule,
    LikeModule,
    AuthModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
