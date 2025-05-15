import { Module  } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserProfileApiController } from './user-profile.api.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [UserProfileController, UserProfileApiController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
