import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserProfileApiController } from './user-profile.api.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CaslModule } from 'nest-casl';
import { userProfilePermissions } from './premissions/user-profile.premissions';
import { StorageService } from '../storage/storage.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    CaslModule.forFeature({ permissions: userProfilePermissions }),
    StorageModule,
  ],
  controllers: [UserProfileController, UserProfileApiController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
