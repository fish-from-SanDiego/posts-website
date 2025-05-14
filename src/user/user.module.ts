import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserApiController } from './user.api.controller';
import { AuthModule } from '../auth/auth.module';
import { UserSessionApiController } from './user.session.api.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController, UserApiController, UserSessionApiController],
  providers: [UserService],
})
export class UserModule {}
