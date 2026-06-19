"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Info, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

export function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // NOTE: connect to the auth backend in the portal phase.
    setSubmitted(true);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Log in to your Blue Fox client portal.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">Email</span>
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
              Password
              <Link href="#" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </span>
            <input
              required
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className={inputClass}
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" className="h-4 w-4 accent-[var(--color-primary)]" />
            Remember me
          </label>

          {submitted && (
            <div className="flex items-start gap-2.5 rounded-lg border border-primary/30 bg-primary-soft/40 px-3 py-2.5 text-sm text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                The client portal is launching soon. Your login will be activated
                once it goes live — thanks for your patience!
              </span>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full">
            <LogIn className="h-4 w-4" /> Log in
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
            Create one <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
}
