"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

export function ContactForm() {
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
        <h3 className="mt-5 text-xl font-semibold text-foreground">Message sent!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Thanks {form.name ? form.name.split(" ")[0] : "there"} — our team will get
          back to you within 24 hours. For anything urgent, message us on WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
          }}
          className="mt-6 text-sm font-medium text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-surface p-6 sm:p-7"
    >
      <h3 className="text-lg font-semibold text-foreground">Send us a message</h3>
      <p className="mt-1 text-sm text-muted">
        Fill in the form and we&apos;ll reply within 24 hours.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <input
            required
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={update("name")}
            className={inputClass}
          />
        </Field>
        <Field label="Email" required>
          <input
            required
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={update("email")}
            className={inputClass}
          />
        </Field>
        <Field label="Phone / WhatsApp">
          <input
            type="tel"
            placeholder="+971 ..."
            value={form.phone}
            onChange={update("phone")}
            className={inputClass}
          />
        </Field>
        <Field label="Subject">
          <input
            type="text"
            placeholder="How can we help?"
            value={form.subject}
            onChange={update("subject")}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Message" required>
          <textarea
            required
            rows={5}
            placeholder="Write your message..."
            value={form.message}
            onChange={update("message")}
            className={inputClass}
          />
        </Field>
      </div>

      <Button type="submit" size="lg" className="mt-5 w-full">
        Send message <Send className="h-4 w-4" />
      </Button>
      <p className="mt-3 text-center text-[11px] text-muted-2">
        By submitting, you agree to our Privacy Policy. We never share your details.
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
