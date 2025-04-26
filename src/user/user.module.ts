import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserApiController } from './user.api.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, UserApiController],
  providers: [UserService],
})
export class UserModule {}
