import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bot,
  Users,
  Wallet,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Overview" };

export default async function AdminOverview() {
  const [
    pendingDeposits,
    pendingWithdrawals,
    activeContracts,
    clientCount,
    walletAgg,
    earningAgg,
  ] = await Promise.all([
    db.deposit.count({ where: { status: "pending" } }),
    db.withdrawal.count({ where: { status: "pending" } }),
    db.contract.count({ where: { status: "active" } }),
    db.user.count({ where: { role: "client" } }),
    db.wallet.aggregate({
      _sum: { availableCents: true, investedCents: true, totalDepositedCents: true, totalWithdrawnCents: true },
    }),
    db.earning.aggregate({ _sum: { amountCents: true } }),
  ]);

  const queues = [
    {
      href: "/admin/deposits",
      label: "Pending deposits",
      count: pendingDeposits,
      icon: ArrowDownToLine,
      tone: pendingDeposits > 0 ? "text-warning" : "text-muted-2",
    },
    {
      href: "/admin/withdrawals",
      label: "Pending withdrawals",
      count: pendingWithdrawals,
      icon: ArrowUpFromLine,
      tone: pendingWithdrawals > 0 ? "text-warning" : "text-muted-2",
    },
    {
      href: "/admin/contracts",
      label: "Active contracts",
      count: activeContracts,
      icon: Bot,
      tone: "text-primary",
    },
    {
      href: "/admin/users",
      label: "Clients",
      count: clientCount,
      icon: Users,
      tone: "text-foreground",
    },
  ];

  const money = [
    { label: "Total deposited", value: walletAgg._sum.totalDepositedCents ?? 0, icon: ArrowDownToLine },
    { label: "Currently invested", value: walletAgg._sum.investedCents ?? 0, icon: Bot },
    { label: "Returns paid out", value: earningAgg._sum.amountCents ?? 0, icon: TrendingUp },
    { label: "Client balances", value: walletAgg._sum.availableCents ?? 0, icon: Wallet },
  ];

  return (
    <Container className="max-w-7xl py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Operations overview</h1>
      <p className="mt-1 text-muted">Approve money movements and keep contracts paying out.</p>

      {/* Queues */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {queues.map((q) => (
          <Link
            key={q.label}
            href={q.href}
            className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-2">{q.label}</span>
              <q.icon className={`h-4 w-4 ${q.tone}`} />
            </div>
            <p className="mt-2 text-3xl font-semibold text-foreground">{q.count}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Open <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>

      {/* Money */}
      <h2 className="mt-12 text-lg font-semibold text-foreground">Money on the platform</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {money.map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-2">{m.label}</span>
              <m.icon className="h-4 w-4 text-muted-2" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">{formatCents(m.value)}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
