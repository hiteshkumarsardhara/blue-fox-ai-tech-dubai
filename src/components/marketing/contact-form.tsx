"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/i18n/i18n-provider";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

export function ContactForm() {
  const { t } = useTranslations();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // NOTE: wire this to the backend / email service in a later phase.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-border bg-surface p-8 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-foreground">{t("marketing.contact.successTitle")}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          {t("marketing.contact.successThanks")}{" "}
          {form.name ? form.name.split(" ")[0] : t("marketing.contact.successFallbackName")}{" "}
          {t("marketing.contact.successBody")}
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
          }}
          className="mt-6 text-sm font-medium text-primary hover:underline"
        >
          {t("marketing.contact.sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-surface p-6 sm:p-7"
    >
      <h3 className="text-lg font-semibold text-foreground">{t("marketing.contact.formTitle")}</h3>
      <p className="mt-1 text-sm text-muted">
        {t("marketing.contact.formIntro")}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label={t("marketing.contact.fieldName")} required>
          <input
            required
            type="text"
            placeholder={t("marketing.contact.placeholderName")}
            value={form.name}
            onChange={update("name")}
            className={inputClass}
          />
        </Field>
        <Field label={t("marketing.contact.fieldEmail")} required>
          <input
            required
            type="email"
            placeholder={t("marketing.contact.placeholderEmail")}
            value={form.email}
            onChange={update("email")}
            className={inputClass}
          />
        </Field>
        <Field label={t("marketing.contact.fieldPhone")}>
          <input
            type="tel"
            placeholder={t("marketing.contact.placeholderPhone")}
            value={form.phone}
            onChange={update("phone")}
            className={inputClass}
          />
        </Field>
        <Field label={t("marketing.contact.fieldSubject")}>
          <input
            type="text"
            placeholder={t("marketing.contact.placeholderSubject")}
            value={form.subject}
            onChange={update("subject")}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label={t("marketing.contact.fieldMessage")} required>
          <textarea
            required
            rows={5}
            placeholder={t("marketing.contact.placeholderMessage")}
            value={form.message}
            onChange={update("message")}
            className={inputClass}
          />
        </Field>
      </div>

      <Button type="submit" size="lg" className="mt-5 w-full">
        {t("marketing.contact.submitButton")} <Send className="h-4 w-4" />
      </Button>
      <p className="mt-3 text-center text-[11px] text-muted-2">
        {t("marketing.contact.privacyNote")}
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}
