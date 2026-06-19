import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, ShieldCheck, ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";
import { AdminNav } from "@/components/admin/admin-nav";

const ADMIN_ROLES = ["admin", "finance", "support"];

/** Auth-guarded shell for the admin panel (staff only). */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!ADMIN_ROLES.includes(user.role)) redirect("/portal");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Logo height={38} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="hidden items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground sm:inline-flex"
            >
              <ExternalLink className="h-4 w-4" /> Client view
            </Link>
            <span className="hidden text-sm text-muted sm:block">
              {user.name} · <span className="capitalize text-foreground">{user.role}</span>
            </span>
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
        <div className="mx-auto max-w-7xl px-5 py-2 sm:px-8">
          <AdminNav />
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
