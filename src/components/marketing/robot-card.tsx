import Link from "next/link";
import { ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatUSD } from "@/lib/utils";
import type { Robot } from "@/lib/site";

const riskTone = {
  Low: "success",
  Medium: "accent",
  High: "danger",
} as const;

export function RobotCard({ robot }: { robot: Robot }) {
  const top = robot.monthlyReturnFloor + robot.monthlyReturnUpside;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-[0_0_0_1px] hover:shadow-primary/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{robot.name}</h3>
          <p className="mt-0.5 text-sm text-muted">{robot.tagline}</p>
        </div>
        {robot.badge && <Badge tone="primary">{robot.badge}</Badge>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tone="neutral">{robot.trades}</Badge>
        <Badge tone={riskTone[robot.riskLevel]}>{robot.riskLevel} risk</Badge>
      </div>

      {/* Monthly return — the headline number */}
      <div className="mt-5 rounded-xl border border-primary/20 bg-primary-soft/50 p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted">
          <TrendingUp className="h-3.5 w-3.5 text-primary" /> Target monthly return
        </div>
        <p className="mt-1 text-2xl font-semibold text-foreground">
          {robot.monthlyReturnFloor}–{top}
          <span className="text-base font-medium text-muted">% / mo</span>
        </p>
        <p className="text-[11px] text-muted-2">
          {robot.monthlyReturnFloor}% floor + up to {robot.monthlyReturnUpside}% upside
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-2">Contract</dt>
          <dd className="font-medium text-foreground">
            {robot.termMonths.join(" / ")} months
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-2">Min deposit</dt>
          <dd className="font-medium text-foreground">{formatUSD(robot.minDeposit)}</dd>
        </div>
      </dl>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-2">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        Capacity: {robot.capacity} · live-traded by Blue Fox
      </div>

      <Link
        href={`/robots/${robot.slug}`}
        className={buttonVariants({
          variant: robot.badge === "Most popular" ? "primary" : "outline",
          size: "md",
          className: "mt-5 w-full",
        })}
      >
        Rent {robot.name} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function VerifiedNote() {
  return (
    <p className="flex items-center justify-center gap-1.5 text-xs text-muted-2">
      <ShieldCheck className="h-4 w-4 text-success" />
      Trading results independently tracked on MyFXBook &amp; FXBlue
    </p>
  );
}
