import type { Metadata } from "next";
import Link from "next/link";
import { Wallet, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { RentButton } from "@/components/portal/rent-button";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Invest" };

export default async function InvestPage() {
  const user = await getCurrentUser();
  const [robots, wallet] = await Promise.all([
    db.robot.findMany({
      where: { status: "active" },
      orderBy: [{ sortOrder: "asc" }, { depositCents: "asc" }],
    }),
    db.wallet.findUnique({ where: { userId: user!.id } }),
  ]);
  const available = wallet?.availableCents ?? 0;

  return (
    <Container className="py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Rent a robot</h1>
          <p className="mt-1 text-muted">
            Pick a package — the deposit is locked into the contract and pays a fixed monthly return.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-2">
            <Wallet className="h-3.5 w-3.5" /> Available balance
          </p>
          <p className="mt-0.5 text-xl font-semibold text-foreground">{formatCents(available)}</p>
        </div>
      </div>

      {available === 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary-soft px-4 py-3 text-sm">
          <span className="text-foreground">
            Your wallet is empty. Add funds first, then rent a robot.
          </span>
          <Link href="/portal/deposit" className={buttonVariants({ size: "sm" })}>
            Deposit funds <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {robots.map((r) => {
          const monthly = Math.round((r.depositCents * r.monthlyRoi) / 100);
          const totalReturn = monthly * r.contractMonths;
          const affordable = available >= r.depositCents;
          const isDiamond = r.tier.toLowerCase() === "diamond";
          return (
            <div
              key={r.id}
              className="flex flex-col rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
            >
              <div className="flex items-center justify-between">
                <span
                  className={
                    "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide " +
                    (isDiamond
                      ? "border-primary/30 bg-primary-soft text-primary"
                      : "border-accent/30 bg-accent/10 text-accent")
                  }
                >
                  {r.tier}
                </span>
                <span className="text-xs text-muted-2">{r.contractMonths} months</span>
              </div>

              <h3 className="mt-3 text-base font-semibold text-foreground">{r.name}</h3>

              <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
                <p className="text-xs text-muted-2">Deposit</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {formatCents(r.depositCents)}
                </p>
              </div>

              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-muted">
                    <TrendingUp className="h-4 w-4 text-success" /> Monthly return
                  </dt>
                  <dd className="font-semibold text-foreground">
                    {r.monthlyRoi}% · {formatCents(monthly)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-muted">
                    <Clock className="h-4 w-4 text-primary" /> Total over term
                  </dt>
                  <dd className="font-semibold text-success">{formatCents(totalReturn)}</dd>
                </div>
              </dl>

              <div className="mt-5 flex-1" />
              <RentButton robotId={r.id} affordable={affordable} />
            </div>
          );
        })}
      </div>
    </Container>
  );
}
