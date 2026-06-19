import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/portal/status-badge";
import { DepositActions } from "@/components/admin/row-actions";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Deposits" };

export default async function AdminDeposits() {
  const deposits = await db.deposit.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
  });
  const pending = deposits.filter((d) => d.status === "pending");
  const rest = deposits.filter((d) => d.status !== "pending");

  return (
    <Container className="max-w-7xl py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Deposits</h1>
      <p className="mt-1 text-muted">
        Confirm a deposit to credit the client&apos;s wallet. {pending.length} awaiting review.
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
    reference: string | null;
    status: string;
    createdAt: Date;
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
            {rows.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{d.user.name}</p>
                  <p className="text-xs text-muted-2">{d.user.email}</p>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">{formatCents(d.amountCents)}</p>
                  <p className="text-xs text-muted-2">
                    {d.method.toUpperCase()}
                    {d.reference ? ` · ${d.reference}` : ""} · {d.createdAt.toLocaleDateString()}
                  </p>
                </div>
                {actionable ? (
                  <DepositActions id={d.id} />
                ) : (
                  <StatusBadge status={d.status} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
