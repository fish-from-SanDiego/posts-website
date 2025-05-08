export const handlebarsHelpers = {
  json: function (context: any) {
    const replacer = (key: string, value: any) => {
      const excludedKeys = [
        'settings',
        'body',
        'bodySectionScripts',
        'description',
        'cache',
        'footerClasses',
        'footerLinks',
        'headerClasses',
        'headerLinks',
        'specificModuleScripts',
        'specificScripts',
        'specificStylesheets',
        'title',
        'layout',
        'keywords',
        'logoPath',
      ];
      return excludedKeys.includes(key) ? undefined : value;
    };
    return JSON.stringify(context, replacer)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
  },
  formatDateTime: function (value: Date | string) {
    const date = new Date(value);
    const pad = (n: number) => n.toString().padStart(2, '0');

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}.${month}.${year}`;
  },
};
