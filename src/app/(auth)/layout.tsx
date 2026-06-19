import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";

/** Minimal, focused chrome for the auth pages (no marketing header/ticker). */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-[0.18]" />
      <div className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[500px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-[150px]" />

      <header className="px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12">
        <Logo height={78} className="mb-8" />
        {children}
      </main>

      <footer className="px-5 py-6 text-center text-xs text-muted-2">
        © {new Date().getFullYear()} Blue Fox Dubai ·{" "}
        <Link href="/legal/terms" className="hover:text-foreground">Terms</Link> ·{" "}
        <Link href="/legal/privacy" className="hover:text-foreground">Privacy</Link>
      </footer>
    </div>
  );
}
