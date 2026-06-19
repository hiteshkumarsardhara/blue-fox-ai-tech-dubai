import type { Metadata } from "next";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bot,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function PortalDashboard() {
  const user = await getCurrentUser();
  const w = user?.wallet ?? {
    availableCents: 0,
    investedCents: 0,
    totalEarningsCents: 0,
    totalDepositedCents: 0,
  };

  const stats = [
    { label: "Available balance", value: w.availableCents, icon: Wallet, tone: "text-primary" },
    { label: "Invested", value: w.investedCents, icon: PiggyBank, tone: "text-foreground" },
    { label: "Total earnings", value: w.totalEarningsCents, icon: TrendingUp, tone: "text-success" },
    { label: "Total deposited", value: w.totalDepositedCents, icon: ArrowDownToLine, tone: "text-foreground" },
  ];

  const actions = [
    { label: "Deposit funds", desc: "Top up your wallet via crypto or bank.", icon: ArrowDownToLine },
    { label: "Rent a robot", desc: "Choose a package and start earning.", icon: Bot },
    { label: "Withdraw", desc: "Cash out via crypto, bank or cash.", icon: ArrowUpFromLine },
  ];

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-muted">Here&apos;s your Blue Fox account overview.</p>
        </div>
        <Badge tone="success">Account active</Badge>
      </div>

      {/* Wallet stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-2">
                {s.label}
              </span>
              <s.icon className="h-4 w-4 text-muted-2" />
            </div>
            <p className={`mt-2 text-2xl font-semibold ${s.tone}`}>{formatCents(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="mt-12 text-lg font-semibold text-foreground">Quick actions</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {actions.map((a) => (
          <div key={a.label} className="relative rounded-2xl border border-border bg-surface p-5 opacity-90">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
              <a.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">{a.label}</h3>
            <p className="mt-1 text-sm text-muted">{a.desc}</p>
            <span className="mt-3 inline-block rounded-full border border-border-strong bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-muted-2">
              Coming next
            </span>
          </div>
        ))}
      </div>

      {/* Account info */}
      <h2 className="mt-12 text-lg font-semibold text-foreground">Account</h2>
      <div className="mt-4 max-w-xl divide-y divide-border rounded-2xl border border-border bg-surface">
        {[
          { k: "Name", v: user?.name },
          { k: "Email", v: user?.email },
          { k: "Country", v: user?.country || "—" },
          { k: "KYC status", v: user?.kycStatus },
        ].map((row) => (
          <div key={row.k} className="flex items-center justify-between gap-4 px-5 py-3">
            <span className="text-sm text-muted">{row.k}</span>
            <span className="text-sm font-medium text-foreground">{row.v}</span>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-2">
        Deposit, robot rental, monthly returns and withdrawals are being wired up
        next — your dashboard will come fully alive shortly.
      </p>
    </Container>
  );
}
