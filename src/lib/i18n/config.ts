/** Cookie-based i18n config. Add a locale here + a dictionary file to expand. */

export const locales = [
  "en", "ar", "es", "fr", "hi", "zh", "pt", "ru",
  "de", "id", "tr", "ur", "ja", "bn", "ko", "fa",
] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const rtlLocales: readonly Locale[] = ["ar", "ur", "fa"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  es: "Español",
  fr: "Français",
  hi: "हिन्दी",
  zh: "中文",
  pt: "Português",
  ru: "Русский",
  de: "Deutsch",
  id: "Bahasa Indonesia",
  tr: "Türkçe",
  ur: "اردو",
  ja: "日本語",
  bn: "বাংলা",
  ko: "한국어",
  fa: "فارسی",
};

export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
