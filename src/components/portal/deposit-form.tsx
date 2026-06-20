"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { depositAction } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/i18n/i18n-provider";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

export function DepositForm() {
  const { t } = useTranslations();
  const METHODS = [
    { value: "usdt", label: t("portal.deposit.methodUsdt") },
    { value: "usdc", label: t("portal.deposit.methodUsdc") },
    { value: "bank", label: t("portal.deposit.methodBank") },
  ];
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
      <h2 className="text-lg font-semibold text-foreground">{t("portal.deposit.formTitle")}</h2>
      <p className="mt-1 text-sm text-muted">
        {t("portal.deposit.formSubtitle")}
      </p>

      {done && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-success/30 bg-success-soft px-3 py-2.5 text-sm text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t("portal.deposit.successMessage")}</span>
        </div>
      )}

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">{t("portal.deposit.amountLabel")}</span>
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
          <span className="mb-1.5 block text-xs font-medium text-muted">{t("portal.deposit.methodLabel")}</span>
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
            {t("portal.deposit.referenceLabel")} <span className="text-muted-2">{t("portal.deposit.optional")}</span>
          </span>
          <input
            placeholder={t("portal.deposit.referencePlaceholder")}
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
        {loading ? t("portal.deposit.submitting") : t("portal.deposit.submit")}
      </Button>
    </form>
  );
}
