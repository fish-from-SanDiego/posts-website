import { Header } from './header.interface';

export default <Header>{
  headerClasses: {
    header: 'page-header page-header--sticky-at-top page-header--page-wide',
    headerLogo: 'page-header__logo',
    inner: 'page-header__inner',
    innerContent: 'page-header__inner-content',
    logoImage: 'page-header__logo-image',
    menu: 'page-header__menu',
    menuLink: 'page-header__menu-link',
    profileLink: 'page-header__menu-profile',
    loginButton: 'page-header__menu-login-button',
  },
  logoPath: 'resources/images/logo.png',
  headerLinks: [
    { url: './factorio-article', text: 'Статьи' },
    { url: './table', text: 'Таблица' },
    { url: './loan-calc', text: 'Расчёт платежей' },
    { url: './some-post', text: 'Какой-то пост' },
  ],
  userLoggedIn: true,
  loggedUser: { profileLink: '.', username: 'Username' },
  loginLink: '.',
};
