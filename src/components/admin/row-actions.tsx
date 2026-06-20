"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, Banknote, TrendingUp, ShieldCheck } from "lucide-react";
import {
  confirmDepositAction,
  rejectDepositAction,
  payWithdrawalAction,
  rejectWithdrawalAction,
  creditEarningAction,
  approveKycAction,
  rejectKycAction,
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

const CANNED_REASONS = [
  "Photo blurry / unreadable",
  "Document expired",
  "Name mismatch",
  "Wrong document type",
  "Glare or cropped",
];

export function KycActions({ id }: { id: string }) {
  const { run, pending, error } = useRowAction();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  if (rejecting) {
    return (
      <div className="flex w-full max-w-xs flex-col items-end gap-2">
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (shown to the client)"
          className="w-full rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm text-foreground placeholder:text-muted-2 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
        <div className="flex flex-wrap justify-end gap-1">
          {CANNED_REASONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setReason(c)}
              className="rounded-full border border-border-strong px-2 py-0.5 text-[11px] text-muted transition-colors hover:text-foreground"
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            disabled={pending || !reason.trim()}
            onClick={() => run(() => rejectKycAction(id, reason.trim()))}
            className={`${btn} bg-danger-soft text-danger hover:bg-danger/20`}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            Confirm reject
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setRejecting(false)}
            className={`${btn} border border-border-strong text-muted hover:text-foreground`}
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          disabled={pending}
          onClick={() => run(() => approveKycAction(id))}
          className={`${btn} bg-success-soft text-success hover:bg-success/20`}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          Approve
        </button>
        <button
          disabled={pending}
          onClick={() => setRejecting(true)}
          className={`${btn} border border-border-strong text-muted hover:text-danger`}
        >
          <X className="h-4 w-4" /> Reject
        </button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
