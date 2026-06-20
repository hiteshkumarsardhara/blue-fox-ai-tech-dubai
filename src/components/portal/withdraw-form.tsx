"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { withdrawAction } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/i18n-provider";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

export function WithdrawForm({ available }: { available: number }) {
  const { t } = useTranslations();
  const [form, setForm] = useState({ amount: "", method: "crypto", destination: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const METHODS = [
    { value: "crypto", label: t("portal.withdraw.optCrypto") },
    { value: "bank", label: t("portal.withdraw.optBank") },
    { value: "cash", label: t("portal.withdraw.optCash") },
  ];

  const DEST: Record<string, { label: string; placeholder: string }> = {
    crypto: {
      label: t("portal.withdraw.cryptoLabel"),
      placeholder: t("portal.withdraw.cryptoPlaceholder"),
    },
    bank: {
      label: t("portal.withdraw.bankLabel"),
      placeholder: t("portal.withdraw.bankPlaceholder"),
    },
    cash: {
      label: t("portal.withdraw.cashLabel"),
      placeholder: t("portal.withdraw.cashPlaceholder"),
    },
  };

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
      <h2 className="text-lg font-semibold text-foreground">{t("portal.withdraw.formTitle")}</h2>
      <p className="mt-1 text-sm text-muted">
        {t("portal.withdraw.formSubtitle")}
      </p>

      {done && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-success/30 bg-success-soft px-3 py-2.5 text-sm text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t("portal.withdraw.successMessage")}</span>
        </div>
      )}

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted">
            <span>{t("portal.withdraw.amountLabel")}</span>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, amount: String(available / 100) }))}
              className="text-primary hover:underline"
            >
              {t("portal.withdraw.max")} {formatCents(available)}
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
          <span className="mb-1.5 block text-xs font-medium text-muted">{t("portal.withdraw.methodLabel")}</span>
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
        {loading ? t("portal.withdraw.submitting") : t("portal.withdraw.submit")}
      </Button>
    </form>
  );
}
