"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n/config";

type Dict = Record<string, unknown>;

const I18nContext = createContext<{ dict: Dict; locale: Locale }>({ dict: {}, locale: "en" });

/** Makes the current locale's dictionary available to client components. */
export function I18nProvider({
  dict,
  locale,
  children,
}: {
  dict: Dict;
  locale: Locale;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={{ dict, locale }}>{children}</I18nContext.Provider>;
}

/** Client-side translations. Use `t("a.b.c")`. */
export function useTranslations() {
  const { dict, locale } = useContext(I18nContext);
  const t = (key: string): string => {
    const value = key
      .split(".")
      .reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Dict)[k] : undefined), dict);
    return typeof value === "string" ? value : key;
  };
  return { t, locale };
}
