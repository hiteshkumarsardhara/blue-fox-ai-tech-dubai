import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Users" };

export default async function AdminUsers() {
  const users = await db.user.findMany({
    include: {
      wallet: true,
      _count: { select: { contracts: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <Container className="max-w-7xl py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
      <p className="mt-1 text-muted">{users.length} registered accounts.</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-2">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">KYC</th>
              <th className="px-5 py-3 text-right font-medium">Available</th>
              <th className="px-5 py-3 text-right font-medium">Invested</th>
              <th className="px-5 py-3 text-right font-medium">Robots</th>
              <th className="px-5 py-3 text-right font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-surface-2/40">
                <td className="px-5 py-3">
                  <p className="font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-2">{u.email}</p>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize " +
                      (u.role === "client"
                        ? "bg-surface-2 text-muted"
                        : "bg-accent/10 text-accent")
                    }
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 capitalize text-muted">{u.kycStatus}</td>
                <td className="px-5 py-3 text-right font-medium text-foreground">
                  {formatCents(u.wallet?.availableCents ?? 0)}
                </td>
                <td className="px-5 py-3 text-right text-muted">
                  {formatCents(u.wallet?.investedCents ?? 0)}
                </td>
                <td className="px-5 py-3 text-right text-muted">{u._count.contracts}</td>
                <td className="px-5 py-3 text-right text-xs text-muted-2">
                  {u.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
