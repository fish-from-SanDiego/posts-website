export interface Head {
  title: string;
  keywords: string;
  description: string;
  specificScripts: Array<string>;
  specificModuleScripts: Array<string>;
  specificStylesheets: Array<string>;
  currentPageSection?: string;
}
