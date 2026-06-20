import type { Metadata } from "next";
import { Users, Gift, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LocalTime } from "@/components/ui/local-time";
import { ReferralLink } from "@/components/portal/referral-link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/utils";
import { getTranslations } from "@/lib/i18n";

export const metadata: Metadata = { title: "Referrals" };

export default async function ReferralsPage() {
  const { t } = await getTranslations();
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
    { label: t("portal.referrals.totalReferrals"), value: String(referrals.length), icon: Users },
    { label: t("portal.referrals.activeInvestors"), value: String(invested), icon: TrendingUp },
    { label: t("portal.referrals.commissionEarned"), value: formatCents(totalEarned), icon: Gift },
  ];

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("portal.referrals.title")}</h1>
      <p className="mt-1 text-muted">
        {t("portal.referrals.introBefore")}{" "}
        <span className="font-semibold text-foreground">{pct}%</span> {t("portal.referrals.introAfter")}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Share card */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-foreground">{t("portal.referrals.inviteFriends")}</h2>
          <p className="mt-1 text-sm text-muted">
            {t("portal.referrals.inviteSubtitle")}
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
      <h2 className="mt-12 text-lg font-semibold text-foreground">{t("portal.referrals.yourReferrals")}</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
        {referrals.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted-2">
            {t("portal.referrals.emptyState")}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {referrals.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-2">{t("portal.referrals.joined")} <LocalTime iso={r.createdAt.toISOString()} mode="date" /></p>
                </div>
                <span
                  className={
                    "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium " +
                    (r._count.contracts > 0
                      ? "border-success/30 bg-success-soft text-success"
                      : "border-border-strong bg-surface-2 text-muted-2")
                  }
                >
                  {r._count.contracts > 0 ? t("portal.referrals.statusInvesting") : t("portal.referrals.statusSignedUp")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
