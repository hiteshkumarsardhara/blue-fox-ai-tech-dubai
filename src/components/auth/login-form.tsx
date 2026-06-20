"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { loginAction } from "@/app/(auth)/actions";
import { useTranslations } from "@/components/i18n/i18n-provider";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

const STAFF = ["admin", "finance", "support"];

export function LoginForm({
  title,
  subtitle,
  showSignup = true,
}: {
  title?: string;
  subtitle?: string;
  showSignup?: boolean;
}) {
  const { t } = useTranslations();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await loginAction({ email: form.email, password: form.password });
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    // Staff go to the admin panel; everyone else to the client portal.
    router.push(res.role && STAFF.includes(res.role) ? "/admin" : "/portal");
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title ?? t("auth.welcome")}
        </h1>
        <p className="mt-1.5 text-sm text-muted">{subtitle ?? t("auth.loginSubtitle")}</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">{t("auth.email")}</span>
            <input
              required
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted">
              {t("auth.password")}
              <Link href="/forgot-password" className="text-primary hover:underline">
                {t("auth.forgot")}
              </Link>
            </span>
            <PasswordInput
              required
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" className="h-4 w-4 accent-[var(--color-primary)]" />
            {t("auth.remember")}
          </label>

          {error && (
            <p className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2.5 text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? (
              t("auth.loggingIn")
            ) : (
              <>
                <LogIn className="h-4 w-4" /> {t("auth.logIn")}
              </>
            )}
          </Button>
        </form>

        {showSignup && (
          <p className="mt-5 text-center text-sm text-muted">
            {t("auth.noAccount")}{" "}
            <Link href="/register" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              {t("auth.createOne")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
