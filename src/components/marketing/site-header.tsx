import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MobileMenu } from "@/components/marketing/mobile-menu";
import { buttonVariants } from "@/components/ui/button";
import { mainNav } from "@/lib/site";

/** Sticky top navigation for the public marketing site. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo priority height={40} />

        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Log in
          </Link>
          <Link href="/register" className={buttonVariants({ variant: "primary", size: "sm" })}>
            Get started
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
