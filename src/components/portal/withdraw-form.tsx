"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { withdrawAction } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

const METHODS = [
  { value: "crypto", label: "Crypto (USDT/USDC)" },
  { value: "bank", label: "Bank transfer" },
  { value: "cash", label: "Cash pickup" },
];

const DEST: Record<string, { label: string; placeholder: string }> = {
  crypto: {
    label: "Wallet address & network",
    placeholder: "e.g. TRC20 address: T... ",
  },
  bank: {
    label: "Bank account details",
    placeholder: "Account name, number, IBAN/IFSC, bank name",
  },
  cash: {
    label: "Pickup area & contact",
    placeholder: "City / area for cash pickup + your contact number",
  },
};

export function WithdrawForm({ available }: { available: number }) {
  const [form, setForm] = useState({ amount: "", method: "crypto", destination: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const dest = DEST[form.method];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await withdrawAction(form);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
    setForm({ amount: "", method: "crypto", destination: "" });
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold text-foreground">Request a withdrawal</h2>
      <p className="mt-1 text-sm text-muted">
        Funds are held as soon as you request, then released once our team approves.
      </p>

      {done && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-success/30 bg-success-soft px-3 py-2.5 text-sm text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Withdrawal requested! It is now pending approval.</span>
        </div>
      )}

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted">
            <span>Amount (USD)</span>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, amount: String(available / 100) }))}
              className="text-primary hover:underline"
            >
              Max {formatCents(available)}
            </button>
          </span>
          <input
            required
            inputMode="decimal"
            placeholder="e.g. 500"
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
          <span className="mb-1.5 block text-xs font-medium text-muted">{dest.label}</span>
          <textarea
            required
            rows={3}
            placeholder={dest.placeholder}
            value={form.destination}
            onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
            className={inputClass}
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={loading || available <= 0}
        className="mt-5 w-full"
      >
        {loading ? "Submitting..." : "Request withdrawal"}
      </Button>
    </form>
  );
}
