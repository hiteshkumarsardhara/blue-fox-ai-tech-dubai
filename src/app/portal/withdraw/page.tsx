import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { WithdrawForm } from "@/components/portal/withdraw-form";
import { StatusBadge } from "@/components/portal/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Withdraw" };

const METHOD_LABEL: Record<string, string> = {
  crypto: "Crypto",
  bank: "Bank transfer",
  cash: "Cash pickup",
};

export default async function WithdrawPage() {
  const user = await getCurrentUser();
  const [wallet, withdrawals] = await Promise.all([
    db.wallet.findUnique({ where: { userId: user!.id } }),
    db.withdrawal.findMany({
      where: { userId: user!.id },
      orderBy: { requestedAt: "desc" },
      take: 8,
    }),
  ]);
  const available = wallet?.availableCents ?? 0;
  const kyc = user!.kycStatus ?? "none";
  const verified = kyc === "approved";

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Withdraw funds</h1>
      <p className="mt-1 text-muted">
        Available to withdraw:{" "}
        <span className="font-semibold text-foreground">{formatCents(available)}</span>
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {verified ? (
          <WithdrawForm available={available} />
        ) : (
          <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-warning/30 bg-warning/10 text-warning">
              {kyc === "pending" ? <Clock className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            </span>
            <h2 className="mt-4 text-base font-semibold text-foreground">
              {kyc === "pending" ? "Verification under review" : "Verify your identity first"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {kyc === "pending"
                ? "Your documents are being reviewed. Withdrawals unlock once you're approved (usually 24–48h)."
                : "To protect your funds, withdrawals require a verified identity. It only takes a minute."}
            </p>
            {kyc !== "pending" && (
              <Link href="/portal/kyc" className={buttonVariants({ className: "mt-4" })}>
                <ShieldAlert className="h-4 w-4" />
                {kyc === "rejected" ? "Re-submit documents" : "Verify identity"}
              </Link>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-foreground">Recent withdrawals</h2>
          {withdrawals.length === 0 ? (
            <p className="mt-3 text-sm text-muted-2">No withdrawals yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {withdrawals.map((w) => (
                <li key={w.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCents(w.amountCents)}
                    </p>
                    <p className="text-xs text-muted-2">
                      {METHOD_LABEL[w.method] ?? w.method} · {w.requestedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={w.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}
