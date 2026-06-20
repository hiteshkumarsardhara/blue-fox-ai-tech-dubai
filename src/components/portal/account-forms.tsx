"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { updateProfileAction, changePasswordAction } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslations } from "@/components/i18n/i18n-provider";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

function Saved({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <div className="mt-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
      <CheckCircle2 className="h-4 w-4 shrink-0" /> {text}
    </div>
  );
}

function Err({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
      {text}
    </p>
  );
}

export function ProfileForm({ phone, country }: { phone: string; country: string }) {
  const { t } = useTranslations();
  const [form, setForm] = useState({ phone, country });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDone(false);
    const res = await updateProfileAction(form);
    setLoading(false);
    if (!res.ok) return setError(res.error);
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-base font-semibold text-foreground">{t("portal.account.profile")}</h2>
      <p className="mt-1 text-sm text-muted">{t("portal.account.profileSubtitle")}</p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">{t("portal.account.phoneWhatsapp")}</span>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+1 555 123 4567 (with country code)"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">{t("portal.account.country")}</span>
          <input
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            placeholder="United Arab Emirates"
            className={inputClass}
          />
        </label>
      </div>

      <Err text={error} />
      <Saved show={done} text={t("portal.account.profileUpdated")} />

      <Button type="submit" disabled={loading} className="mt-5">
        {loading ? t("portal.account.saving") : t("portal.account.saveChanges")}
      </Button>
    </form>
  );
}

export function PasswordForm() {
  const { t } = useTranslations();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);
    if (form.next !== form.confirm) return setError(t("portal.account.passwordsMismatch"));
    setLoading(true);
    const res = await changePasswordAction({ current: form.current, next: form.next });
    setLoading(false);
    if (!res.ok) return setError(res.error);
    setDone(true);
    setForm({ current: "", next: "", confirm: "" });
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-base font-semibold text-foreground">{t("portal.account.changePassword")}</h2>
      <p className="mt-1 text-sm text-muted">{t("portal.account.passwordHint")}</p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">{t("portal.account.currentPassword")}</span>
          <PasswordInput
            required
            value={form.current}
            onChange={(e) => setForm((f) => ({ ...f, current: e.target.value }))}
            placeholder={t("portal.account.currentPasswordPlaceholder")}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">{t("portal.account.newPassword")}</span>
          <PasswordInput
            required
            value={form.next}
            onChange={(e) => setForm((f) => ({ ...f, next: e.target.value }))}
            placeholder={t("portal.account.newPasswordPlaceholder")}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">{t("portal.account.confirmNewPassword")}</span>
          <PasswordInput
            required
            value={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
            placeholder={t("portal.account.confirmNewPasswordPlaceholder")}
          />
        </label>
      </div>

      <Err text={error} />
      <Saved show={done} text={t("portal.account.passwordChanged")} />

      <Button type="submit" disabled={loading} className="mt-5">
        {loading ? t("portal.account.updating") : t("portal.account.updatePassword")}
      </Button>
    </form>
  );
}
