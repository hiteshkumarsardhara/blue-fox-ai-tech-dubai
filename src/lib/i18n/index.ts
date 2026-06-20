import { cookies } from "next/headers";
import { defaultLocale, isLocale, isRtl, LOCALE_COOKIE, type Locale } from "./config";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  hi: () => import("./dictionaries/hi.json").then((m) => m.default),
  zh: () => import("./dictionaries/zh.json").then((m) => m.default),
  pt: () => import("./dictionaries/pt.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
  de: () => import("./dictionaries/de.json").then((m) => m.default),
  id: () => import("./dictionaries/id.json").then((m) => m.default),
  tr: () => import("./dictionaries/tr.json").then((m) => m.default),
  ur: () => import("./dictionaries/ur.json").then((m) => m.default),
  ja: () => import("./dictionaries/ja.json").then((m) => m.default),
  bn: () => import("./dictionaries/bn.json").then((m) => m.default),
  ko: () => import("./dictionaries/ko.json").then((m) => m.default),
  fa: () => import("./dictionaries/fa.json").then((m) => m.default),
} as const;

/** Current locale from the cookie (defaults to `en`). */
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

type Dict = Record<string, unknown>;

/** Server-side translations for the current locale. Use `t("a.b.c")`. */
export async function getTranslations() {
  const locale = await getLocale();
  const dict = (await dictionaries[locale]()) as Dict;
  const t = (key: string): string => {
    const value = key
      .split(".")
      .reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Dict)[k] : undefined), dict);
    return typeof value === "string" ? value : key;
  };
  return { locale, dir: isRtl(locale) ? ("rtl" as const) : ("ltr" as const), t };
}
