import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserProfileApiController } from './user-profile.api.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { UnauthorizedMiddleware } from '../auth/unauthorized.middleware';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserProfileController, UserProfileApiController],
  providers: [UserProfileService],
})
export class UserProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UserProfileController);
      // .apply(UnauthorizedMiddleware)
      // .forRoutes(UserProfileController);
  }
}
