export interface Footer {
  footerClasses: {
    footer: string;
    footerInner: string;
    footerInnerContent: string;
    linksContainer: string;
    menuLink: string;
  };
  footerLinks: Array<{ url: string; text: string }>;
}
