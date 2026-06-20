"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { mainNav } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/i18n-provider";

/** Hamburger menu for small screens (client island inside the server header). */
export function MobileMenu() {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="grid h-10 w-10 place-items-center rounded-lg border border-border-strong text-foreground"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-surface/95 backdrop-blur">
          <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-5 py-4 sm:px-8">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-2 hover:text-foreground"
              >
                {item.tKey ? t(item.tKey) : item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "primary", size: "md" }))}
              >
                {t("common.register")}
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={buttonVariants({ variant: "outline", size: "md" })}
              >
                {t("common.login")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
