import Link from "next/link";
import { Check, Crown, Gem } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatUSD } from "@/lib/utils";
import { monthlyEarnings, type BotPackage } from "@/lib/site";

export function PackageCard({ pkg }: { pkg: BotPackage }) {
  const gold = pkg.tier === "Golden";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-surface p-5 transition-colors",
        pkg.highlight
          ? gold
            ? "border-accent/60 shadow-[0_0_0_1px] shadow-accent/30"
            : "border-primary/60 shadow-[0_0_0_1px] shadow-primary/30"
          : "border-border hover:border-border-strong",
      )}
    >
      {pkg.highlight && (
        <span
          className={cn(
            "absolute -top-3 left-5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
            gold ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground",
          )}
        >
          Popular
        </span>
      )}

      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "grid h-8 w-8 place-items-center rounded-lg",
            gold ? "bg-accent/15 text-accent" : "bg-primary-soft text-primary",
          )}
        >
          {gold ? <Crown className="h-4 w-4" /> : <Gem className="h-4 w-4" />}
        </span>
        <h3 className="text-base font-semibold text-foreground">{pkg.name}</h3>
      </div>

      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-wide text-muted-2">Deposit</p>
        <p className="text-2xl font-semibold text-foreground">{formatUSD(pkg.deposit)}</p>
      </div>

      <div
        className={cn(
          "mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-semibold",
          gold ? "bg-accent/10 text-accent" : "bg-primary-soft text-primary",
        )}
      >
        {pkg.monthlyRoi}% <span className="font-medium text-muted">/ month ROI</span>
      </div>

      <ul className="mt-4 flex-1 space-y-1.5 text-sm text-muted">
        <li className="flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0 text-success" /> ≈ {formatUSD(monthlyEarnings(pkg))} / month
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0 text-success" /> {pkg.contractMonths}-month contract
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0 text-success" /> Capital back in 3 parts
        </li>
      </ul>

      <Link
        href="/register"
        className={cn(
          "mt-5 w-full",
          buttonVariants({
            variant: pkg.highlight ? (gold ? "accent" : "primary") : "outline",
            size: "md",
          }),
        )}
      >
        Invest now
      </Link>
    </div>
  );
}
