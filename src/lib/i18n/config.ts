/** Cookie-based i18n config. Add a locale here + a dictionary file to expand. */

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const rtlLocales: readonly Locale[] = ["ar"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
