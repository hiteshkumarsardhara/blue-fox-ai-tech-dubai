import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bot,
  PiggyBank,
  TrendingUp,
  Wallet,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/portal/status-badge";
import { LocalTime } from "@/components/ui/local-time";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/utils";
import { getTranslations } from "@/lib/i18n";

export const metadata: Metadata = { title: "Dashboard" };

export default async function PortalDashboard() {
  const { t } = await getTranslations();
  const user = await getCurrentUser();
  const w = user?.wallet ?? {
    availableCents: 0,
    investedCents: 0,
    totalEarningsCents: 0,
    totalDepositedCents: 0,
  };

  const [contracts, recent] = await Promise.all([
    db.contract.findMany({
      where: { userId: user!.id, status: "active" },
      include: { robot: true, earnings: true },
      orderBy: { createdAt: "desc" },
    }),
    db.ledgerEntry.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: t("portal.dashboard.availableBalance"), value: w.availableCents, icon: Wallet, tone: "text-primary" },
    { label: t("portal.dashboard.invested"), value: w.investedCents, icon: PiggyBank, tone: "text-foreground" },
    { label: t("portal.dashboard.totalEarnings"), value: w.totalEarningsCents, icon: TrendingUp, tone: "text-success" },
    { label: t("portal.dashboard.totalDeposited"), value: w.totalDepositedCents, icon: ArrowDownToLine, tone: "text-foreground" },
  ];

  const actions = [
    { href: "/portal/deposit", label: t("portal.dashboard.depositFunds"), desc: t("portal.dashboard.depositFundsDesc"), icon: ArrowDownToLine },
    { href: "/portal/invest", label: t("portal.dashboard.rentARobot"), desc: t("portal.dashboard.rentARobotDesc"), icon: Bot },
    { href: "/portal/withdraw", label: t("portal.dashboard.withdraw"), desc: t("portal.dashboard.withdrawDesc"), icon: ArrowUpFromLine },
  ];

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("portal.dashboard.welcomeBack")}, {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-muted">{t("portal.dashboard.accountOverview")}</p>
        </div>
        <Badge tone="success">{t("portal.dashboard.accountActive")}</Badge>
      </div>

      {/* KYC nudge */}
      {user?.kycStatus !== "approved" && (
        <Link
          href="/portal/kyc"
          className="mt-6 flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/5 px-5 py-4 transition-colors hover:border-warning/50"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-warning/30 bg-warning/10 text-warning">
            {user?.kycStatus === "pending" ? (
              <ShieldCheck className="h-5 w-5" />
            ) : (
              <ShieldAlert className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              {user?.kycStatus === "pending"
                ? t("portal.dashboard.kycPendingTitle")
                : user?.kycStatus === "rejected"
                  ? t("portal.dashboard.kycRejectedTitle")
                  : t("portal.dashboard.kycVerifyTitle")}
            </p>
            <p className="text-sm text-muted">
              {user?.kycStatus === "pending"
                ? t("portal.dashboard.kycPendingDesc")
                : t("portal.dashboard.kycVerifyDesc")}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-2" />
        </Link>
      )}

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
      <h2 className="mt-12 text-lg font-semibold text-foreground">{t("portal.dashboard.quickActions")}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="group relative rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/40"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
              <a.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 flex items-center gap-1 font-semibold text-foreground">
              {a.label}
              <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </h3>
            <p className="mt-1 text-sm text-muted">{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Active robots */}
      <div className="mt-12 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{t("portal.dashboard.yourRobots")}</h2>
        <Link href="/portal/invest" className="text-sm font-medium text-primary hover:underline">
          {t("portal.dashboard.rentAnother")}
        </Link>
      </div>
      {contracts.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border-strong bg-surface/50 px-6 py-10 text-center">
          <Bot className="mx-auto h-8 w-8 text-muted-2" />
          <p className="mt-3 text-sm text-muted">
            {t("portal.dashboard.noRobotsYet")}{" "}
            <Link href="/portal/invest" className="font-medium text-primary hover:underline">
              {t("portal.dashboard.browsePackages")}
            </Link>
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {contracts.map((c) => {
            const paid = c.earnings.length;
            const pct = Math.round((paid / c.termMonths) * 100);
            const monthly = Math.round((c.principalCents * c.monthlyRoi) / 100);
            return (
              <div key={c.id} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{c.robot.name}</h3>
                  <StatusBadge status={c.status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-2">{t("portal.dashboard.principal")}</p>
                    <p className="font-semibold text-foreground">{formatCents(c.principalCents)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-2">{t("portal.dashboard.monthly")}</p>
                    <p className="font-semibold text-success">{formatCents(monthly)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-2">{t("portal.dashboard.paidOut")}</p>
                    <p className="font-semibold text-foreground">{formatCents(c.totalPaidOutCents)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-2">
                    <span>{paid} / {c.termMonths} {t("portal.dashboard.months")}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent activity */}
      <div className="mt-12 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{t("portal.dashboard.recentActivity")}</h2>
        <Link href="/portal/transactions" className="text-sm font-medium text-primary hover:underline">
          {t("portal.dashboard.viewAll")}
        </Link>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
        {recent.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-2">{t("portal.dashboard.noActivityYet")}</p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((e) => {
              const credit = e.amountCents >= 0;
              return (
                <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium capitalize text-foreground">
                      {e.note ?? e.type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-muted-2"><LocalTime iso={e.createdAt.toISOString()} /></p>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums ${credit ? "text-success" : "text-foreground"}`}>
                    {credit ? "+" : "−"}
                    {formatCents(Math.abs(e.amountCents))}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Account info */}
      <h2 className="mt-12 text-lg font-semibold text-foreground">{t("portal.dashboard.account")}</h2>
      <div className="mt-4 max-w-xl divide-y divide-border rounded-2xl border border-border bg-surface">
        {[
          { k: t("portal.dashboard.name"), v: user?.name, cap: false },
          { k: t("portal.dashboard.email"), v: user?.email, cap: false },
          { k: t("portal.dashboard.country"), v: user?.country || "—", cap: false },
          { k: t("portal.dashboard.kycStatus"), v: user?.kycStatus, cap: true },
        ].map((row) => (
          <div key={row.k} className="flex items-center justify-between gap-4 px-5 py-3">
            <span className="text-sm text-muted">{row.k}</span>
            <span className={`text-sm font-medium text-foreground ${row.cap ? "capitalize" : ""}`}>
              {row.v}
            </span>
          </div>
        ))}
      </div>
    </Container>
  );
}
