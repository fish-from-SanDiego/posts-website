import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import defaultHeader from './templateModels/header.default';
import defaultFooter from './templateModels/footer.default';
import { Head } from './templateModels/head.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getMainPage() {
    const headInfo: Head = {
      title: 'Главная',
      description: 'Главная сайта',
      keywords: 'Сайт',
      specificScripts: [],
      specificStylesheets: ['resources/styles/index.css'],
    };
    return Object.assign(
      { layout: 'main' },
      defaultHeader,
      defaultFooter,
      headInfo,
      {
        logoPath: 'resources/images/logo_current.png',
      },
    );
  }

  @Get('factorio_article')
  @Render('factorio_article')
  getArticlePage() {
    const headInfo: Head = {
      title: 'Эффективный ядерный реактор в Factorio',
      description: 'Гайд по ядерному реактору в Factorio',
      keywords: 'Factorio,гайд,ядерный реактор,видеоигры',
      specificScripts: ['resources/js/page-load-time.js'],
      specificStylesheets: [
        'resources/styles/factorio_article.css',
        'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css',
      ],
    };
    return Object.assign(
      {
        layout: 'main',
        bodySectionScripts: [
          'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js',
          'resources/js/fancybox_local_ru.js',
          'resources/js/article_galleries.js',
        ],
      },
      defaultHeader,
      defaultFooter,
      headInfo,
    );
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
