import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserApiController } from './user.api.controller';
import { AuthModule } from '../auth/auth.module';
import { UserSessionApiController } from './user.session.api.controller';
import { CaslModule } from 'nest-casl';
import { userPermissions } from './permissions/user.permissions';
import { UserController } from './user.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CaslModule.forFeature({ permissions: userPermissions }),
    StorageModule,
  ],
  controllers: [UserApiController, UserController, UserSessionApiController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
