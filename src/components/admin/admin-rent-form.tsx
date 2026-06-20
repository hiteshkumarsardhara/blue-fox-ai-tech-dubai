"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { adminRentAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/lib/utils";

const selectClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

export function AdminRentForm({
  clients,
  robots,
}: {
  clients: { id: string; name: string; email: string }[];
  robots: { id: string; name: string; depositCents: number; tier: string }[];
}) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [robotId, setRobotId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);
    if (!userId || !robotId) {
      setError("Select a client and a robot.");
      return;
    }
    setLoading(true);
    const res = await adminRentAction(userId, robotId);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
    setRobotId("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-base font-semibold text-foreground">Rent a robot for a client (override)</h2>
      <p className="mt-1 text-sm text-muted">
        Bypasses the upgrade-only rule — admin only. The client still needs enough wallet balance.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Client</span>
          <select value={userId} onChange={(e) => setUserId(e.target.value)} className={selectClass}>
            <option value="">Select a client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Robot</span>
          <select value={robotId} onChange={(e) => setRobotId(e.target.value)} className={selectClass}>
            <option value="">Select a robot…</option>
            {robots.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {formatCents(r.depositCents)} ({r.tier})
              </option>
            ))}
          </select>
        </label>

        <Button type="submit" disabled={loading}>
          {loading ? "Renting..." : "Rent"}
        </Button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
      {done && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Robot rented for the client.
        </div>
      )}
    </form>
  );
}
