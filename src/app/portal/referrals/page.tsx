import type { Metadata } from "next";
import { Users, Gift, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ReferralLink } from "@/components/portal/referral-link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Referrals" };

export default async function ReferralsPage() {
  const user = await getCurrentUser();

  const [referrals, commissionAgg, pctRow] = await Promise.all([
    db.user.findMany({
      where: { referredById: user!.id },
      select: { id: true, name: true, createdAt: true, _count: { select: { contracts: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.ledgerEntry.aggregate({
      where: { userId: user!.id, type: "referral_commission" },
      _sum: { amountCents: true },
    }),
    db.setting.findUnique({ where: { key: "referral_commission_pct" } }),
  ]);

  const totalEarned = commissionAgg._sum.amountCents ?? 0;
  const invested = referrals.filter((r) => r._count.contracts > 0).length;
  const pct = pctRow?.value ?? "5";

  const stats = [
    { label: "Total referrals", value: String(referrals.length), icon: Users },
    { label: "Active investors", value: String(invested), icon: TrendingUp },
    { label: "Commission earned", value: formatCents(totalEarned), icon: Gift },
  ];

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Refer &amp; earn</h1>
      <p className="mt-1 text-muted">
        Share your link. When someone you refer rents a robot, you earn{" "}
        <span className="font-semibold text-foreground">{pct}%</span> of their deposit — credited
        straight to your wallet.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Share card */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-foreground">Invite friends</h2>
          <p className="mt-1 text-sm text-muted">
            They get started in a minute; you earn on every robot they rent.
          </p>
          <div className="mt-5">
            <ReferralLink code={user!.referralCode} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-2">
                  {s.label}
                </span>
                <s.icon className="h-4 w-4 text-muted-2" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referred users */}
      <h2 className="mt-12 text-lg font-semibold text-foreground">Your referrals</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
        {referrals.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted-2">
            No referrals yet. Share your link to get started.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {referrals.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-2">Joined {r.createdAt.toLocaleDateString()}</p>
                </div>
                <span
                  className={
                    "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium " +
                    (r._count.contracts > 0
                      ? "border-success/30 bg-success-soft text-success"
                      : "border-border-strong bg-surface-2 text-muted-2")
                  }
                >
                  {r._count.contracts > 0 ? "Investing" : "Signed up"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
