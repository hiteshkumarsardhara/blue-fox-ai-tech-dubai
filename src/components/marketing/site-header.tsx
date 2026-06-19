import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MobileMenu } from "@/components/marketing/mobile-menu";
import { buttonVariants } from "@/components/ui/button";
import { mainNav } from "@/lib/site";

/** Sticky top navigation for the public marketing site. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo priority height={60} />

        <nav className="hidden items-center xl:flex">
          {mainNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-2 py-2 text-[13px] font-medium text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Link href="/register" className={buttonVariants({ variant: "primary", size: "sm" })}>
            Register
          </Link>
          <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Login
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
