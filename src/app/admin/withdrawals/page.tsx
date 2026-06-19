import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/portal/status-badge";
import { WithdrawalActions } from "@/components/admin/row-actions";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Withdrawals" };

const METHOD_LABEL: Record<string, string> = {
  crypto: "Crypto",
  bank: "Bank",
  cash: "Cash",
};

export default async function AdminWithdrawals() {
  const withdrawals = await db.withdrawal.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: [{ status: "asc" }, { requestedAt: "desc" }],
    take: 100,
  });
  const pending = withdrawals.filter((w) => w.status === "pending");
  const rest = withdrawals.filter((w) => w.status !== "pending");

  return (
    <Container className="max-w-7xl py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Withdrawals</h1>
      <p className="mt-1 text-muted">
        Funds are already held. Mark paid once sent, or reject to refund the client.{" "}
        {pending.length} awaiting review.
      </p>

      <Section title="Awaiting review" rows={pending} actionable />
      {rest.length > 0 && <Section title="Processed" rows={rest} />}
    </Container>
  );
}

function Section({
  title,
  rows,
  actionable,
}: {
  title: string;
  rows: Array<{
    id: string;
    amountCents: number;
    method: string;
    destination: string;
    status: string;
    requestedAt: Date;
    user: { name: string; email: string };
  }>;
  actionable?: boolean;
}) {
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-2">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-border-strong bg-surface/50 px-5 py-8 text-center text-sm text-muted-2">
          Nothing here.
        </p>
      ) : (
        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-surface">
          <ul className="divide-y divide-border">
            {rows.map((w) => (
              <li key={w.id} className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{w.user.name}</p>
                  <p className="text-xs text-muted-2">{w.user.email}</p>
                </div>
                <div className="min-w-0 max-w-xs text-sm">
                  <p className="font-semibold text-foreground">
                    {formatCents(w.amountCents)}{" "}
                    <span className="text-xs font-normal text-muted-2">
                      via {METHOD_LABEL[w.method] ?? w.method}
                    </span>
                  </p>
                  <p className="mt-0.5 break-words text-xs text-muted">{w.destination}</p>
                </div>
                {actionable ? (
                  <WithdrawalActions id={w.id} />
                ) : (
                  <StatusBadge status={w.status} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
