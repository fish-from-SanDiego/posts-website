import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import { ConfigNamespaces } from './config/config.namespaces';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MethodOverrideMiddleware } from './app.middlewares';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService<ConfigNamespaces>);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.engine(
    'hbs',
    hbs.engine({
      extname: 'hbs',
      layoutsDir: join(__dirname, '..', 'views', 'layouts'),
      partialsDir: join(__dirname, '..', 'views', 'partials'),
    }),
  );
  app.setViewEngine('hbs');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(new MethodOverrideMiddleware().use);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = new DocumentBuilder()
    .setTitle('API сайта')
    .setDescription(
      'API позволяет манипулировать постами, пользователями, их профилями, комментариями, категориями',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.useGlobalFilters(new GlobalFilter());
  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

bootstrap();
