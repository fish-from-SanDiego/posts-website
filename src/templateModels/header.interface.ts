export interface Header {
  logoPath: string;
  headerClasses: {
    header: string;
    inner: string;
    innerContent: string;
    headerLogo: string;
    logoImage: string;
    menu: string;
    menuLink: string;
    profileLink: string;
    loginButton: string;
  };
  headerLinks: Array<{ url: string; text: string }>;
  loginLink: string | null;
}
