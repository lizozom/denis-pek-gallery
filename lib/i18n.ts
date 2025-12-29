export const locales = ['en', 'he'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'he';

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
