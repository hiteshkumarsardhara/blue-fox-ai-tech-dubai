import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MobileMenu } from "@/components/marketing/mobile-menu";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { buttonVariants } from "@/components/ui/button";
import { mainNav } from "@/lib/site";
import { getTranslations } from "@/lib/i18n";

/** Sticky top navigation for the public marketing site. */
export async function SiteHeader() {
  const { t, locale } = await getTranslations();
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
        <Logo priority height={60} />

        <nav className="hidden items-center xl:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2 py-2 text-[13px] font-medium text-muted transition-colors hover:text-foreground"
            >
              {item.tKey ? t(item.tKey) : item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <LanguageSwitcher current={locale} />
          <Link href="/register" className={buttonVariants({ variant: "primary", size: "sm" })}>
            {t("common.register")}
          </Link>
          <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
            {t("common.login")}
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
