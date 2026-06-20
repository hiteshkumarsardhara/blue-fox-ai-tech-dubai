"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { setLocaleAction } from "@/app/i18n-actions";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <label className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-2.5 py-1.5 text-muted">
      <Globe className="h-4 w-4" />
      <select
        aria-label="Language"
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          start(async () => {
            await setLocaleAction(next);
            router.refresh();
          });
        }}
        className="cursor-pointer bg-transparent text-sm font-medium text-foreground focus:outline-none"
      >
        {locales.map((l) => (
          <option key={l} value={l} className="bg-surface text-foreground">
            {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
