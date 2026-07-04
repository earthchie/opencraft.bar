import en from './en.json';
import th from './th.json';

const translations: Record<string, Record<string, any>> = { en, th };

export function t(key: string, locale: string): string {
  const keys = key.split('.');
  let value: any = translations[locale] || translations['en'];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      let fallback: any = translations['en'];
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return key; // Return the key itself if not found
        }
      }
      return typeof fallback === 'string' ? fallback : key;
    }
  }

  return typeof value === 'string' ? value : key;
}

export function getStaticPathsLocale(locale: string) {
  return { locale };
}
