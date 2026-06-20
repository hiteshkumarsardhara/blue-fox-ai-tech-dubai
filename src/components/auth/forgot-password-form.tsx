"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestPasswordResetAction } from "@/app/(auth)/actions";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await requestPasswordResetAction({ email });
    setLoading(false);
    if (!res.ok) return setError(res.error);
    setDone(true);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        {done ? (
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
              <Mail className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-muted">
              If an account exists for <span className="font-medium text-foreground">{email}</span>,
              we&apos;ve sent a link to reset your password. It expires in 1 hour.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Forgot your password?
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <label className="mt-6 block">
              <span className="mb-1.5 block text-xs font-medium text-muted">Email</span>
              <input
                required
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </label>

            {error && (
              <p className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={loading} className="mt-5 w-full">
              {loading ? "Sending..." : "Send reset link"}
            </Button>

            <p className="mt-5 text-center text-sm text-muted">
              Remembered it?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
