import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import defaultHeader from './templateModels/header.default';
import defaultFooter from './templateModels/footer.default';
import { Head } from './templateModels/head.interface';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController(true)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getMainPage(): any {
    const headInfo: Head = {
      title: 'Главная',
      description: 'Главная сайта',
      keywords: 'Сайт',
      specificScripts: [],
      specificModuleScripts: [],
      specificStylesheets: ['/resources/styles/index.css'],
      currentPageSection: '',
    };
    return Object.assign(
      { layout: 'main' },
      { ...defaultHeader },
      defaultFooter,
      headInfo,
      {
        logoPath: 'resources/images/logo_current.png',
      },
    );
  }

  @Get('factorio-article')
  @Render('factorio_article')
  getArticlePage() {
    const headInfo: Head = {
      title: 'Эффективный ядерный реактор в Factorio',
      description: 'Гайд по ядерному реактору в Factorio',
      keywords: 'Factorio,гайд,ядерный реактор,видеоигры',
      specificScripts: ['/resources/js/page-load-time.js'],
      specificModuleScripts: [],
      specificStylesheets: [
        'resources/styles/factorio_article.css',
        'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css',
      ],
      currentPageSection: 'Factorio',
    };
    return Object.assign(
      {
        layout: 'main',
        bodySectionScripts: [
          'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js',
          '/resources/js/fancybox_local_ru.js',
          '/resources/js/article_galleries.js',
        ],
      },
      defaultHeader,
      defaultFooter,
      headInfo,
    );
  }

  @Get('loan-calc')
  @Render('loan_calc')
  getLoanCalcPage() {
    const headInfo: Head = {
      title: 'Расчёт платежей кредита',
      description: 'Расчёт платежей кредита',
      keywords: 'Расчёт, кредит, платежи, калькулятор',
      specificScripts: ['resources/js/loan_calc.js'],
      specificModuleScripts: [],
      specificStylesheets: ['resources/styles/loan_calc.css'],
      currentPageSection: 'Расчёт платежей',
    };
    return Object.assign(
      {
        layout: 'main',
      },
      defaultHeader,
      defaultFooter,
      headInfo,
    );
  }

  @Get('table')
  @Render('table')
  getTablePage() {
    const headInfo: Head = {
      title: 'Таблица - бизнес-план',
      description: 'Таблица',
      keywords: 'Сайт',
      specificScripts: [],
      specificModuleScripts: [],
      specificStylesheets: ['resources/styles/table.css'],
      currentPageSection: 'Таблица',
    };
    return Object.assign(
      {
        layout: 'main',
      },
      defaultHeader,
      defaultFooter,
      headInfo,
    );
  }

  @Get('some-post')
  @Render('some_post')
  getSomePostPage() {
    const headInfo: Head = {
      title: 'Пост',
      description: 'Пост',
      keywords: 'Пост',
      specificScripts: [],
      specificModuleScripts: [
        'resources/js/components/spinning_loader.js',
        'resources/js/comments.js',
      ],
      specificStylesheets: ['resources/styles/some_post.css'],
      currentPageSection: 'Пост (static)',
    };
    return Object.assign(
      {
        layout: 'main',
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
