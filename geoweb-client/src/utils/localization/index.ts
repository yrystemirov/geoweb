export const translateField = (obj: any, attr: string, locale: string = 'ru', suffix: string = '') => {
    if (!obj) return '';
    const loc = locale.charAt(0).toUpperCase() + locale.slice(1);
    return obj[`${attr}${loc}${suffix}`] || '';
};
