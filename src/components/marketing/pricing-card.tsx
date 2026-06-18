import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatUSD } from "@/lib/utils";
import type { Plan } from "@/lib/site";

export function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-surface p-6",
        plan.highlight
          ? "border-primary/60 shadow-[0_0_0_1px] shadow-primary/30"
          : "border-border",
      )}
    >
      {plan.highlight && (
        <div className="absolute -top-3 left-6">
          <Badge tone="primary">Most popular</Badge>
        </div>
      )}

      <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted">{plan.blurb}</p>

      <div className="mt-5">
        {plan.priceLifetime != null && (
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold text-foreground">
              {formatUSD(plan.priceLifetime)}
            </span>
            <span className="text-sm text-muted-2">lifetime</span>
          </div>
        )}
        {plan.priceMonthly != null && (
          <p className="mt-1 text-sm text-muted">
            or {formatUSD(plan.priceMonthly)}
            <span className="text-muted-2">/month</span>
          </p>
        )}
      </div>

      <p className="mt-4 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-muted">
        {plan.accounts}
      </p>

      <ul className="mt-5 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/register"
        className={cn(
          "mt-6 w-full",
          buttonVariants({ variant: plan.highlight ? "primary" : "outline", size: "md" }),
        )}
      >
        Choose {plan.name}
      </Link>
    </div>
  );
}
