import type { Metadata } from "next";
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Lock,
  RotateCcw,
  Receipt,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCents, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Transactions" };

const LABELS: Record<string, string> = {
  registration_fee: "Registration fee",
  deposit: "Deposit credited",
  investment_hold: "Robot rented",
  investment_release: "Investment released",
  earning: "Monthly return",
  withdrawal: "Withdrawal",
  fee: "Fee",
  bonus: "Bonus",
  referral_commission: "Referral commission",
  adjustment: "Adjustment",
};

function iconFor(type: string) {
  switch (type) {
    case "deposit":
      return ArrowDownLeft;
    case "earning":
    case "bonus":
    case "referral_commission":
      return TrendingUp;
    case "withdrawal":
      return ArrowUpRight;
    case "investment_hold":
      return Lock;
    case "investment_release":
    case "adjustment":
      return RotateCcw;
    default:
      return Receipt;
  }
}

export default async function TransactionsPage() {
  const user = await getCurrentUser();
  const entries = await db.ledgerEntry.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
      <p className="mt-1 text-muted">Every movement in your wallet, newest first.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
        {entries.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-muted-2">
            No transactions yet. They’ll appear here once you deposit or earn.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {entries.map((e) => {
              const Icon = iconFor(e.type);
              const credit = e.amountCents >= 0;
              return (
                <li key={e.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full border",
                      credit
                        ? "border-success/30 bg-success-soft text-success"
                        : "border-border-strong bg-surface-2 text-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {LABELS[e.type] ?? e.type}
                    </p>
                    <p className="truncate text-xs text-muted-2">
                      {e.note ? e.note + " · " : ""}
                      {e.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-sm font-semibold tabular-nums",
                        credit ? "text-success" : "text-foreground",
                      )}
                    >
                      {credit ? "+" : "−"}
                      {formatCents(Math.abs(e.amountCents))}
                    </p>
                    <p className="text-xs text-muted-2 tabular-nums">
                      Bal {formatCents(e.balanceAfterCents)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Container>
  );
}
