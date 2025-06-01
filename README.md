# Posts Web App

## Overview
Веб-приложение для создания простых постов (строки title + content) и их комментирования.
Серверная часть написана на Typescript на основе фреймворка Nest.JS. В качестве веб-сервера используется Express JS.
<br>
- Используется подход DDD -> приложение разделено на инфраструктурные модули и модули,
соответствующие сущностям
- Часть контроллеров отдаёт html-страницы, часть - API контроллеры 
- Разделение пользователей на роли - Admin, Moderator, User
- Аутентификация посредством Auth Provider'а SuperTokens
- Редактирование профиля, создание и управление постами, комментариями
- Фото профилей хранятся в бакете Yandex Object Storage 
- С помощью декораторов endpoint'ов и DTO сгенерирована документация в формате OpenAPI


## Доступ к сайту / деплой
Сайт доступен по  ссылке https://fish-from-sandiego.onrender.com.
<br>
Для сборки и запуска локально с помощью скриптов из package.json нужно
определить следующие environment переменные:
<br>
```sh
PORT=2031 # порт, на котором будет слушать сервер
STORAGE_BUCKET=your_backet_name # название бакета в Object Storage
ADMIN_EMAIL=example@mail.com # почта аккаунта админа (будет создан пользователь с ролью Admin)
ADMIN_PASSWORD=M77ypPPa12a232sw@rd # пароль админа
ADMIN_USERNAME=admin # юзернейм админа
APP_DOMAIN=http://localhost # домен приложения - нужен для SuperTokens
DATABASE_URL=postgresql://postgres:postgres@localhost:15432/defaultdb # connection string для БД
SUPERTOKENS_CONNECTION_URL=http://localhost:3567 # connection string для SuperTokens
STORAGE_ACCESS_KEY=your_key # access key к Object Storage
STORAGE_SECRET_KEY=your_key # secret key к Object Storage
```

## Схема БД

![](readme-pics/diagram.png)

## Функционал приложения

### Управление профилем
Есть формы регистрации и логина.
<br>
![](readme-pics/user1.png)
<br>
![](readme-pics/user2.png)
![](readme-pics/user3.png)
<br>
Кнопка “Войти” в правом углу меняется на username при входе в аккаунт.
<br>
![](readme-pics/user4.png)
<br>
Есть возможность изменить фото профиля, статус и описание.
Также можно выйти из аккаунта.
<br>
![](readme-pics/user5.png)
<br>
![](readme-pics/user6.png)
![](readme-pics/user7.png)
![](readme-pics/user8.png)
<br>

### Посты
Можно посмотреть все посты по страницам.
Также есть кнопка переключения на создание поста.
<br>
![](readme-pics/posts1.png)
![](readme-pics/posts2.png)
<br>

### Пост
Можно создать пост, просмотреть и редактировать его.
Также есть выбор категорий поста.
<br>
![](readme-pics/post1.png)
![](readme-pics/post2.png)
<br>
![](readme-pics/post3.png)
<br>
### Комментарии
Под постом расположены комментарии, есть пагинация.
Можно создавать новые комментарии и удалять старые.
<br>
![](readme-pics/comments1.png)
<br>
![](readme-pics/comments2.png)
<br>
![](readme-pics/comments3.png)
<br>
![](readme-pics/comments4.png)
<br>
### API
На сайте доступен Swagger UI с документацией по API EndPoint'ам
<br>
![](readme-pics/api1.png)
![](readme-pics/api2.png)

