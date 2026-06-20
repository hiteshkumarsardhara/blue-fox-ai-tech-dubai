import type { Metadata } from "next";
import { Info } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LocalTime } from "@/components/ui/local-time";
import { DepositForm } from "@/components/portal/deposit-form";
import { StatusBadge } from "@/components/portal/status-badge";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Deposit" };

export default async function DepositPage() {
  const user = await getCurrentUser();
  const deposits = await db.deposit.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  const settings = Object.fromEntries(
    (await db.setting.findMany()).map((s) => [s.key, s.value]),
  );
  const usdt = settings.deposit_usdt_trc20;
  const bank = settings.deposit_bank_details;

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Deposit funds</h1>
      <p className="mt-1 text-muted">
        Top up your wallet. Deposits are credited after our team confirms them.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DepositForm />

        <div className="space-y-6">
          {/* Instructions */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold text-foreground">Where to send</h2>
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-2">USDT (TRC20)</p>
                <p className="mt-0.5 break-all font-medium text-foreground">
                  {usdt || "Will be shared by our team after you submit a request."}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-2">Bank transfer</p>
                <p className="mt-0.5 font-medium text-foreground">
                  {bank || "Will be shared by our team after you submit a request."}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              Always include your transaction reference so we can match your payment quickly.
            </div>
          </div>

          {/* Recent deposits */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold text-foreground">Recent deposits</h2>
            {deposits.length === 0 ? (
              <p className="mt-3 text-sm text-muted-2">No deposits yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {deposits.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{formatCents(d.amountCents)}</p>
                      <p className="text-xs text-muted-2">
                        {d.method.toUpperCase()} · <LocalTime iso={d.createdAt.toISOString()} mode="date" />
                      </p>
                    </div>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
