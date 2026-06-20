import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";
import { PortalNav } from "@/components/portal/portal-nav";

/** Auth-guarded shell for the client portal. */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Logo height={40} />
          <div className="flex items-center gap-3">
            <Link
              href="/portal/account"
              className="hidden text-sm text-muted transition-colors hover:text-foreground sm:block"
            >
              Hi, <span className="font-medium text-foreground">{user.name.split(" ")[0]}</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-6xl px-5 py-2 sm:px-8">
          <PortalNav />
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
