import Link from "next/link";
import { BarChart3, Check, DollarSign, ShieldCheck, TrendingUp } from "lucide-react";
import { cn, formatUSD } from "@/lib/utils";
import { monthlyEarnings, type BotPackage } from "@/lib/site";

const FOREX_PAIRS = ["EURUSD", "XAUUSD", "GBPUSD", "USDJPY"];

/**
 * EA-product-style package card: product box + NFA/MT4-5 + rating badges,
 * a stats list, deposit price, feature icons and a live-equity sparkline.
 */
export function PackageCard({ pkg }: { pkg: BotPackage }) {
  const gold = pkg.tier === "Golden";
  const shortName = pkg.name.replace(/^Bf\s+/, "").replace(/\s+Bot$/, "");
  const rating = (8.5 + (pkg.monthlyRoi - 4) * 0.25).toFixed(1);
  const totalRoi = Math.round(pkg.monthlyRoi * pkg.contractMonths);

  return (
    <Link
      href="/register"
      className={cn(
        "group relative block rounded-2xl border bg-surface p-4 transition-all hover:-translate-y-0.5",
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
            "absolute -top-2.5 left-4 z-10 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            gold ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground",
          )}
        >
          Popular
        </span>
      )}

      <div className="flex gap-4">
        {/* Product box */}
        <div
          className="relative w-[104px] shrink-0 overflow-hidden rounded-xl p-3 text-white shadow-lg"
          style={{
            background: gold
              ? "linear-gradient(155deg,#f7b24a,#e8651c 55%,#7a2e00)"
              : "linear-gradient(155deg,#4f93f0,#1b3a8f 55%,#0c1f4d)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_12%,rgba(255,255,255,0.4),transparent_45%)]" />
          <div className="relative">
            <p className="text-[8px] font-bold uppercase tracking-[0.15em] opacity-90">Blue Fox</p>
            <p className="mt-1 text-3xl font-black leading-none">
              {pkg.monthlyRoi}
              <span className="text-base">%</span>
            </p>
            <p className="text-[8px] font-semibold uppercase opacity-85">per month</p>
            <p className="mt-3 text-[13px] font-extrabold uppercase leading-tight">{shortName}</p>
            <div className="mt-2 space-y-0.5 text-[7.5px] font-medium uppercase leading-tight opacity-80">
              {FOREX_PAIRS.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <span className="mt-2 inline-block rounded bg-white/25 px-1.5 py-0.5 text-[7.5px] font-bold">
              MT4 / MT5
            </span>
          </div>
        </div>

        {/* Badges + title + stats + price */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <span className="inline-flex items-center gap-1 rounded bg-[#0f1115] px-1.5 py-0.5 text-[10px] font-bold text-white">
              NFA <Check className="h-3 w-3 text-success" />
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[#0f1115] px-1.5 py-0.5 text-[10px] font-bold text-white">
              MT4/5 <Check className="h-3 w-3 text-success" />
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-success px-1.5 py-0.5 text-[10px] font-bold text-white">
              <BarChart3 className="h-3 w-3" /> {rating}/10
            </span>
          </div>

          <h3 className="mt-1.5 truncate text-base font-bold text-foreground">{pkg.name}</h3>

          <dl className="mt-2 space-y-1">
            <Row label="Total ROI" value={`${totalRoi}%`} strong />
            <Row label="Monthly" value={`${pkg.monthlyRoi}%`} />
            <Row label="Income / mo" value={`≈ ${formatUSD(monthlyEarnings(pkg))}`} />
            <Row label="Contract" value={`${pkg.contractMonths} months`} />
          </dl>

          <p className="mt-2 text-2xl font-extrabold text-primary">
            {formatUSD(pkg.deposit)}{" "}
            <span className="text-[11px] font-medium text-muted-2">deposit</span>
          </p>
        </div>
      </div>

      {/* Feature icons + live equity chart */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {[BarChart3, TrendingUp, DollarSign, ShieldCheck].map((Icon, i) => (
            <span
              key={i}
              className="grid h-8 w-8 place-items-center rounded-full border border-border-strong bg-surface-2 text-muted"
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          ))}
        </div>
        <MiniChart gold={gold} />
      </div>

      {/* CTA */}
      <span
        className={cn(
          "mt-4 flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold transition-colors",
          gold
            ? "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
            : "bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground",
        )}
      >
        Invest now
      </span>
    </Link>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={cn("text-sm font-semibold", strong ? "text-success" : "text-foreground")}>
        {value}
      </dd>
    </div>
  );
}

function MiniChart({ gold }: { gold: boolean }) {
  const color = gold ? "var(--color-accent)" : "var(--color-primary)";
  const id = gold ? "equity-gold" : "equity-blue";
  return (
    <svg
      viewBox="0 0 120 44"
      preserveAspectRatio="none"
      className="h-11 w-36 rounded-md border border-border bg-[#0a1020]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M2,40 L14,36 L26,38 L38,30 L50,32 L62,24 L74,26 L86,17 L98,12 L110,7 L118,4 L118,44 L2,44 Z"
        fill={`url(#${id})`}
      />
      <path
        d="M2,40 L14,36 L26,38 L38,30 L50,32 L62,24 L74,26 L86,17 L98,12 L110,7 L118,4"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
