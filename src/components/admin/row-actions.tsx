"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, Banknote, TrendingUp } from "lucide-react";
import {
  confirmDepositAction,
  rejectDepositAction,
  payWithdrawalAction,
  rejectWithdrawalAction,
  creditEarningAction,
} from "@/app/admin/actions";

type Action = () => Promise<{ ok: true } | { ok: false; error: string }>;

function useRowAction() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const run = (fn: Action) =>
    start(async () => {
      setError("");
      const res = await fn();
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  return { run, pending, error };
}

const btn =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50";

export function DepositActions({ id }: { id: string }) {
  const { run, pending, error } = useRowAction();
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          disabled={pending}
          onClick={() => run(() => confirmDepositAction(id))}
          className={`${btn} bg-success-soft text-success hover:bg-success/20`}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Confirm
        </button>
        <button
          disabled={pending}
          onClick={() => run(() => rejectDepositAction(id))}
          className={`${btn} border border-border-strong text-muted hover:text-danger`}
        >
          <X className="h-4 w-4" /> Reject
        </button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function WithdrawalActions({ id }: { id: string }) {
  const { run, pending, error } = useRowAction();
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          disabled={pending}
          onClick={() => run(() => payWithdrawalAction(id))}
          className={`${btn} bg-success-soft text-success hover:bg-success/20`}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
          Mark paid
        </button>
        <button
          disabled={pending}
          onClick={() => run(() => rejectWithdrawalAction(id))}
          className={`${btn} border border-border-strong text-muted hover:text-danger`}
        >
          <X className="h-4 w-4" /> Reject
        </button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function CreditButton({ id }: { id: string }) {
  const { run, pending, error } = useRowAction();
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        disabled={pending}
        onClick={() => run(() => creditEarningAction(id))}
        className={`${btn} bg-primary-soft text-primary hover:bg-primary/20`}
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
        Credit next month
      </button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
