import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ProfileForm, PasswordForm } from "@/components/portal/account-forms";
import { StatusBadge } from "@/components/portal/status-badge";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Account settings</h1>
      <p className="mt-1 text-muted">Manage your details and security.</p>

      {/* Read-only identity */}
      <div className="mt-8 max-w-xl divide-y divide-border rounded-2xl border border-border bg-surface">
        {[
          { k: "Name", v: user!.name },
          { k: "Email", v: user!.email },
        ].map((row) => (
          <div key={row.k} className="flex items-center justify-between gap-4 px-5 py-3">
            <span className="text-sm text-muted">{row.k}</span>
            <span className="text-sm font-medium text-foreground">{row.v}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <span className="text-sm text-muted">Identity (KYC)</span>
          <StatusBadge status={user!.kycStatus} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ProfileForm phone={user!.phone ?? ""} country={user!.country ?? ""} />
        <PasswordForm />
      </div>
    </Container>
  );
}
