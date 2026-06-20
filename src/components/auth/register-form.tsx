"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronsDown,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { termsOfService } from "@/lib/legal";
import { REGISTRATION_FEE } from "@/lib/site";
import { registerAction } from "@/app/(auth)/actions";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

type Step = 1 | 2 | 3;

export function RegisterForm({ initialRef = "" }: { initialRef?: string }) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirm: "",
    referralCode: initialRef,
  });
  const [error, setError] = useState("");
  const [reachedBottom, setReachedBottom] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);

  const update = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function handleDetails(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setStep(2);
  }

  // If the terms fit without scrolling, unlock immediately.
  useEffect(() => {
    if (step !== 2) return;
    const el = termsRef.current;
    if (el && el.scrollHeight <= el.clientHeight + 8) setReachedBottom(true);
  }, [step]);

  function onTermsScroll() {
    const el = termsRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
      setReachedBottom(true);
    }
  }

  async function handleComplete() {
    setSubmitting(true);
    setError("");
    const res = await registerAction({
      name: form.name,
      email: form.email,
      phone: form.phone,
      country: form.country,
      password: form.password,
      referralCode: form.referralCode,
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setStep(3);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <StepIndicator step={step} />

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        {step === 1 && (
          <form onSubmit={handleDetails}>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              One-time{" "}
              <span className="font-semibold text-foreground">${REGISTRATION_FEE}</span>{" "}
              registration fee. Takes about a minute.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input required type="text" placeholder="John Doe" value={form.name} onChange={update("name")} className={inputClass} />
              </Field>
              <Field label="Email" required>
                <input required type="email" placeholder="you@email.com" value={form.email} onChange={update("email")} className={inputClass} />
              </Field>
              <Field label="Phone / WhatsApp" required>
                <input required type="tel" placeholder="+971 ..." value={form.phone} onChange={update("phone")} className={inputClass} />
              </Field>
              <Field label="Country" required>
                <input required type="text" placeholder="United Arab Emirates" value={form.country} onChange={update("country")} className={inputClass} />
              </Field>
              <Field label="Password" required>
                <PasswordInput required placeholder="Min. 6 characters" value={form.password} onChange={update("password")} />
              </Field>
              <Field label="Confirm password" required>
                <PasswordInput required placeholder="Re-enter password" value={form.confirm} onChange={update("confirm")} />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Referral code (optional)">
                <input
                  type="text"
                  placeholder="Enter a code if you were referred"
                  value={form.referralCode}
                  onChange={update("referralCode")}
                  className={inputClass}
                />
              </Field>
              {initialRef && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Referral applied
                </p>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-6 w-full">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="mt-4 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to details
            </button>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              Accept the Terms &amp; Conditions
            </h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Please read the full document. You must scroll to the bottom to continue.
            </p>

            {/* Scrollable terms */}
            <div className="relative mt-5">
              <div
                ref={termsRef}
                onScroll={onTermsScroll}
                className="h-80 overflow-y-auto rounded-xl border border-border bg-background/60 p-5"
              >
                <h2 className="text-base font-semibold text-foreground">
                  {termsOfService.title}
                </h2>
                <p className="mt-1 text-xs text-muted-2">Last updated: {termsOfService.updated}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{termsOfService.intro}</p>

                <div className="mt-5 space-y-6">
                  {termsOfService.sections.map((s) => (
                    <section key={s.id}>
                      <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                      <div className="mt-2 space-y-2">
                        {s.blocks.map((block, i) =>
                          typeof block === "string" ? (
                            <p key={i} className="text-sm leading-relaxed text-muted">{block}</p>
                          ) : (
                            <ul key={i} className="space-y-1.5">
                              {block.list.map((item) => (
                                <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ),
                        )}
                      </div>
                    </section>
                  ))}
                  <p className="border-t border-border pt-4 text-center text-xs font-medium text-success">
                    — End of Terms &amp; Conditions —
                  </p>
                </div>
              </div>

              {/* Scroll hint */}
              {!reachedBottom && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center rounded-b-xl bg-gradient-to-t from-surface to-transparent pb-3 pt-10">
                  <span className="pointer-events-none inline-flex animate-bounce items-center gap-1.5 rounded-full border border-border-strong bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
                    <ChevronsDown className="h-3.5 w-3.5" /> Scroll to read all terms
                  </span>
                </div>
              )}
            </div>

            {/* Read confirmation */}
            <div
              className={cn(
                "mt-3 flex items-center gap-2 text-xs",
                reachedBottom ? "text-success" : "text-muted-2",
              )}
            >
              {reachedBottom ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> You&apos;ve read the full Terms &amp; Conditions.
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Scroll to the bottom to unlock acceptance.
                </>
              )}
            </div>

            {/* Accept checkbox */}
            <label
              className={cn(
                "mt-4 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                reachedBottom ? "border-border bg-background/40" : "cursor-not-allowed border-border bg-surface-2/40 opacity-60",
              )}
            >
              <input
                type="checkbox"
                disabled={!reachedBottom}
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
              />
              <span className="text-sm text-muted">
                I have read and agree to the{" "}
                <Link href="/legal/terms" target="_blank" className="font-medium text-primary hover:underline">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy" target="_blank" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
                , including the risk disclosure.
              </span>
            </label>

            {error && (
              <p className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button
              type="button"
              size="lg"
              onClick={handleComplete}
              disabled={!reachedBottom || !accepted || submitting}
              className="mt-5 w-full"
            >
              {submitting ? (
                "Creating your account..."
              ) : (
                <>
                  <Check className="h-4 w-4" /> Accept &amp; complete registration
                </>
              )}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="py-6 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              Welcome to Blue Fox, {form.name ? form.name.split(" ")[0] : "investor"}!
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Your account has been created and your Terms acceptance recorded. Next,
              log in to pay your one-time ${REGISTRATION_FEE} registration fee, fund
              your wallet and choose a package.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/portal"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Go to your dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border-strong px-5 text-sm font-medium text-foreground hover:bg-surface-2"
              >
                Back to home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps = ["Your details", "Terms & Conditions", "Done"];
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, i) => {
        const n = (i + 1) as Step;
        const active = step === n;
        const done = step > n;
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "grid h-7 w-7 place-items-center rounded-full text-xs font-semibold transition-colors",
                done
                  ? "bg-success text-white"
                  : active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border-strong text-muted-2",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </span>
            <span
              className={cn(
                "hidden text-xs font-medium sm:block",
                active ? "text-foreground" : "text-muted-2",
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && <span className="h-px w-5 bg-border sm:w-8" />}
          </div>
        );
      })}
    </div>
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
