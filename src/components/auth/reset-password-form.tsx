"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPasswordAction } from "@/app/(auth)/actions";
import { useTranslations } from "@/components/i18n/i18n-provider";

export function ResetPasswordForm({ token }: { token: string }) {
  const { t } = useTranslations();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError(t("auth.passwordsMismatch"));
    setLoading(true);
    const res = await resetPasswordAction({ token, password: form.password });
    setLoading(false);
    if (!res.ok) return setError(res.error);
    setDone(true);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        {!token ? (
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("auth.resetInvalidTitle")}</h1>
            <p className="mt-2 text-sm text-muted">
              {t("auth.resetInvalidText")}
            </p>
            <Link
              href="/forgot-password"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              {t("auth.requestNewLink")}
            </Link>
          </div>
        ) : done ? (
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              {t("auth.resetDoneTitle")}
            </h1>
            <p className="mt-2 text-sm text-muted">{t("auth.resetDoneText")}</p>
            <Link
              href="/login"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("auth.goToLogin")}
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("auth.setNewPassword")}
            </h1>
            <p className="mt-1.5 text-sm text-muted">{t("auth.setNewPasswordHint")}</p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted">{t("auth.newPasswordLabel")}</span>
                <PasswordInput
                  required
                  placeholder={t("auth.minChars")}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted">{t("auth.confirmPassword")}</span>
                <PasswordInput
                  required
                  placeholder={t("auth.reEnterNewPassword")}
                  value={form.confirm}
                  onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                />
              </label>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={loading} className="mt-5 w-full">
              {loading ? t("auth.updating") : t("auth.resetButton")}
            </Button>

            <Link
              href="/login"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> {t("auth.backToLogin")}
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
