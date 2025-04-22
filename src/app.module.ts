import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.app.env'],
      load: [appConfig],
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
