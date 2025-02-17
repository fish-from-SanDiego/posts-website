import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigNamespaces } from './config/config.namespaces';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<ConfigNamespaces>);
  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

bootstrap();
