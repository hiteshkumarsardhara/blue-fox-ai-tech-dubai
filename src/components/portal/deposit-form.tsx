"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { depositAction } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

const METHODS = [
  { value: "usdt", label: "USDT (Crypto)" },
  { value: "usdc", label: "USDC (Crypto)" },
  { value: "bank", label: "Bank transfer" },
];

export function DepositForm() {
  const [form, setForm] = useState({ amount: "", method: "usdt", reference: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await depositAction(form);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
    setForm({ amount: "", method: "usdt", reference: "" });
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold text-foreground">New deposit request</h2>
      <p className="mt-1 text-sm text-muted">
        Submit a request, then send the funds. We credit your wallet after confirming.
      </p>

      {done && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-success/30 bg-success-soft px-3 py-2.5 text-sm text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Deposit request submitted! It will show as “pending” until our team confirms it.</span>
        </div>
      )}

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Amount (USD)</span>
          <input
            required
            inputMode="decimal"
            placeholder="e.g. 3333"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Method</span>
          <select
            value={form.method}
            onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
            className={inputClass}
          >
            {METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">
            Transaction reference <span className="text-muted-2">(optional)</span>
          </span>
          <input
            placeholder="Tx hash / transfer reference"
            value={form.reference}
            onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
            className={inputClass}
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="mt-5 w-full">
        {loading ? "Submitting..." : "Submit deposit request"}
      </Button>
    </form>
  );
}
