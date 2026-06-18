import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";
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
  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{robot.name}</h3>
          <p className="mt-0.5 text-sm text-muted">{robot.tagline}</p>
        </div>
        {robot.badge && <Badge tone="primary">{robot.badge}</Badge>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Badge tone="neutral">{robot.platform}</Badge>
        <Badge tone="neutral">{robot.pairs}</Badge>
        <Badge tone={riskTone[robot.riskLevel]}>{robot.riskLevel} risk</Badge>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-border bg-background/50 p-3 text-center">
        <Stat label="Win rate" value={robot.stats.winRate} />
        <Stat label="Avg / mo" value={robot.stats.monthlyAvg} accent />
        <Stat label="Max DD" value={robot.stats.maxDrawdown} />
      </dl>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-2">
        <BadgeCheck className="h-3.5 w-3.5 text-success" />
        Live-verified · trading since {robot.stats.since}
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-2">From</p>
          <p className="text-xl font-semibold text-foreground">
            {formatUSD(robot.priceFrom)}
          </p>
        </div>
        <Link
          href={`/robots/${robot.slug}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          View robot <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-muted-2">{label}</dt>
      <dd
        className={`mt-0.5 text-sm font-semibold ${accent ? "text-success" : "text-foreground"}`}
      >
        {value}
      </dd>
    </div>
  );
}

export function VerifiedNote() {
  return (
    <p className="flex items-center justify-center gap-1.5 text-xs text-muted-2">
      <ShieldCheck className="h-4 w-4 text-success" />
      Results independently verified on MyFXBook &amp; FXBlue
    </p>
  );
}
