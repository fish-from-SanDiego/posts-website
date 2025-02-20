import { Footer } from './footer.interface';

export default <Footer>{
  footerClasses: {
    footer: 'page-footer page-footer--page-wide',
    footerInner: 'page-footer__inner',
    footerInnerContent: 'page-footer__inner-content vertical-container',
    linksContainer: 'vertical-container__main-item',
    menuLink: 'vertical-container__main-item-link',
  },
  footerLinks: [{ url: '/', text: 'Главная' }],
};
