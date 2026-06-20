import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/portal/status-badge";
import { CreditButton } from "@/components/admin/row-actions";
import { AdminRentForm } from "@/components/admin/admin-rent-form";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Contracts" };

export default async function AdminContracts() {
  const [contracts, clients, robots] = await Promise.all([
    db.contract.findMany({
      include: {
        user: { select: { name: true, email: true } },
        robot: { select: { name: true, tier: true } },
        _count: { select: { earnings: true } },
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 100,
    }),
    db.user.findMany({
      where: { role: "client" },
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: "desc" },
    }),
    db.robot.findMany({
      where: { status: "active" },
      select: { id: true, name: true, depositCents: true, tier: true },
      orderBy: [{ sortOrder: "asc" }, { depositCents: "asc" }],
    }),
  ]);

  return (
    <Container className="max-w-7xl py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Contracts</h1>
      <p className="mt-1 text-muted">
        Credit each month&apos;s fixed return to active robots. A contract completes after its
        final month.
      </p>

      <div className="mt-8">
        <AdminRentForm clients={clients} robots={robots} />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
        {contracts.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-2">No contracts yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {contracts.map((c) => {
              const paid = c._count.earnings;
              const monthly = Math.round((c.principalCents * c.monthlyRoi) / 100);
              const done = paid >= c.termMonths;
              return (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{c.user.name}</p>
                    <p className="text-xs text-muted-2">
                      {c.robot.name} · {c.robot.tier}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <p className="text-xs text-muted-2">Principal</p>
                      <p className="font-semibold text-foreground">{formatCents(c.principalCents)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-2">Monthly ({c.monthlyRoi}%)</p>
                      <p className="font-semibold text-success">{formatCents(monthly)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-2">Progress</p>
                      <p className="font-semibold text-foreground">
                        {paid} / {c.termMonths}
                      </p>
                    </div>
                  </div>

                  {c.status === "active" && !done ? (
                    <CreditButton id={c.id} />
                  ) : (
                    <StatusBadge status={c.status} />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Container>
  );
}
