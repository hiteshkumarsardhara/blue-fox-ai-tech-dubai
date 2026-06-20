"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { saveSettingsAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [form, setForm] = useState({
    deposit_usdt_trc20: initial.deposit_usdt_trc20 ?? "",
    deposit_usdt_erc20: initial.deposit_usdt_erc20 ?? "",
    deposit_bank_details: initial.deposit_bank_details ?? "",
    referral_commission_pct: initial.referral_commission_pct ?? "5",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDone(false);
    const res = await saveSettingsAction(form);
    setLoading(false);
    if (!res.ok) return setError(res.error);
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Deposit addresses */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-base font-semibold text-foreground">Deposit details</h2>
        <p className="mt-1 text-sm text-muted">Shown to clients on the deposit page.</p>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">USDT — TRC20 address</span>
            <input value={form.deposit_usdt_trc20} onChange={set("deposit_usdt_trc20")} placeholder="T..." className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">USDT — ERC20 address</span>
            <input value={form.deposit_usdt_erc20} onChange={set("deposit_usdt_erc20")} placeholder="0x..." className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">Bank transfer details</span>
            <textarea rows={4} value={form.deposit_bank_details} onChange={set("deposit_bank_details")} placeholder="Account name, IBAN, bank, SWIFT…" className={inputClass} />
          </label>
        </div>
      </div>

      {/* Referral */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-base font-semibold text-foreground">Referral program</h2>
        <p className="mt-1 text-sm text-muted">Commission paid to a referrer when their referral rents a robot.</p>
        <label className="mt-5 block max-w-xs">
          <span className="mb-1.5 block text-xs font-medium text-muted">Commission (% of rental deposit)</span>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={form.referral_commission_pct}
            onChange={set("referral_commission_pct")}
            className={inputClass}
          />
        </label>
      </div>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
      )}
      {done && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Settings saved.
        </div>
      )}

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
