"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  DollarSign,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/ui/count-up";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import { monthlyEarnings, type BotPackage } from "@/lib/site";

const FOREX_PAIRS = ["EURUSD", "XAUUSD", "GBPUSD", "USDJPY"];
const FEATURES = [
  { id: "liveTrading", icon: BarChart3, tKey: "home.cardFeatLiveTrading" },
  { id: "monthlyRoi", icon: TrendingUp, tKey: "home.cardFeatMonthlyRoi" },
  { id: "easyWithdraw", icon: DollarSign, tKey: "home.cardFeatEasyWithdraw" },
  { id: "secured", icon: ShieldCheck, tKey: "home.cardFeatSecured" },
];

export function PackageCard({ pkg }: { pkg: BotPackage }) {
  const { t } = useTranslations();
  const gold = pkg.tier === "Golden";
  const reduce = useReducedMotion();
  const shortName = pkg.name.replace(/^Bf\s+/, "").replace(/\s+Bot$/, "");
  const rating = (8.5 + (pkg.monthlyRoi - 4) * 0.25).toFixed(1);
  const totalRoi = Math.round(pkg.monthlyRoi * pkg.contractMonths);
  const roiDecimals = Number.isInteger(pkg.monthlyRoi) ? 0 : 1;
  const accentText = gold ? "text-accent" : "text-primary";

  return (
    <Link
      href="/register"
      className={cn(
        "group relative block overflow-hidden rounded-2xl border bg-gradient-to-b from-surface to-surface-2/40 p-4 transition-all duration-300 hover:-translate-y-1",
        pkg.highlight
          ? gold
            ? "border-accent/60 shadow-[0_0_0_1px] shadow-accent/30 hover:shadow-[0_18px_40px_-12px] hover:shadow-accent/40"
            : "border-primary/60 shadow-[0_0_0_1px] shadow-primary/30 hover:shadow-[0_18px_40px_-12px] hover:shadow-primary/40"
          : "border-border hover:border-border-strong hover:shadow-[0_18px_40px_-16px] hover:shadow-black/60",
      )}
    >
      {/* hover shine sweep */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {pkg.highlight && (
        <span
          className={cn(
            "absolute right-3 top-3 z-10 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            gold ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground",
          )}
        >
          ★ {t("home.cardPopular")}
        </span>
      )}

      <div className="relative grid grid-cols-[112px_1fr] gap-4">
        {/* ── Product box (fills card height) ── */}
        <div
          className="relative flex flex-col overflow-hidden rounded-xl p-3 text-white shadow-lg transition-transform duration-300 group-hover:scale-[1.03]"
          style={{
            background: gold
              ? "linear-gradient(155deg,#f7b24a,#e8651c 55%,#7a2e00)"
              : "linear-gradient(155deg,#4f93f0,#1b3a8f 55%,#0c1f4d)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_10%,rgba(255,255,255,0.45),transparent_45%)]" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          />
          <div className="relative flex flex-1 flex-col">
            <p className="text-[8px] font-bold uppercase tracking-[0.15em] opacity-90">Blue Fox</p>
            <p className="mt-0.5 text-3xl font-black leading-none">
              {pkg.monthlyRoi}
              <span className="text-base">%</span>
            </p>
            <p className="text-[8px] font-semibold uppercase opacity-85">{t("home.cardPerMonth")}</p>
            <p className="mt-2.5 text-[13px] font-extrabold uppercase leading-tight">{shortName}</p>
            <div className="mt-1.5 space-y-0.5 text-[7.5px] font-medium uppercase leading-tight opacity-80">
              {FOREX_PAIRS.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <span className="mt-auto inline-block w-fit rounded bg-white/25 px-1.5 py-0.5 text-[7.5px] font-bold">
              MT4 / MT5
            </span>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="min-w-0">
          {/* Title + badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-foreground">{pkg.name}</h3>
              <p className="text-xs text-muted">{t("home.cardAiForexRobot")} · {pkg.contractMonths}{t("home.cardMoContract")}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
              <span className="inline-flex items-center gap-0.5 rounded bg-[#0f1115] px-1.5 py-0.5 text-[9px] font-bold text-white">
                NFA <Check className="h-2.5 w-2.5 text-success" />
              </span>
              <span className="inline-flex items-center gap-0.5 rounded bg-[#0f1115] px-1.5 py-0.5 text-[9px] font-bold text-white">
                MT4/5 <Check className="h-2.5 w-2.5 text-success" />
              </span>
              <span className="inline-flex items-center gap-0.5 rounded bg-success px-1.5 py-0.5 text-[9px] font-bold text-white">
                <BarChart3 className="h-2.5 w-2.5" /> {rating}
              </span>
            </div>
          </div>

          {/* Stat tiles — fill the space */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            <StatTile label={t("home.cardTotalRoi")}>
              <span className="text-success">
                <CountUp value={totalRoi} suffix="%" />
              </span>
            </StatTile>
            <StatTile label={t("home.cardMonthly")}>
              <span className={accentText}>
                <CountUp value={pkg.monthlyRoi} decimals={roiDecimals} suffix="%" />
              </span>
            </StatTile>
            <StatTile label={t("home.cardIncomeMo")}>
              <CountUp value={monthlyEarnings(pkg)} prefix="$" />
            </StatTile>
            <StatTile label={t("home.cardTerm")}>
              <CountUp value={pkg.contractMonths} suffix="mo" />
            </StatTile>
          </div>

          {/* Animated equity chart */}
          <div className="mt-3">
            <EquityChart gold={gold} reduce={!!reduce} />
          </div>
        </div>
      </div>

      {/* Footer: deposit + features + CTA */}
      <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-2">{t("home.cardDeposit")}</p>
            <p className="text-xl font-extrabold text-primary">
              <CountUp value={pkg.deposit} prefix="$" />
            </p>
          </div>
          <span className="hidden h-9 w-px bg-border sm:block" />
          <div className="hidden gap-1.5 sm:flex">
            {FEATURES.map((f) => (
              <span
                key={f.id}
                title={t(f.tKey)}
                className="grid h-8 w-8 place-items-center rounded-full border border-border-strong bg-surface-2 text-muted transition-colors group-hover:text-foreground"
              >
                <f.icon className="h-3.5 w-3.5" />
              </span>
            ))}
          </div>
        </div>

        <span
          className={cn(
            "inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-colors",
            gold
              ? "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
              : "bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground",
          )}
        >
          {t("home.cardInvestNow")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function StatTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2/50 px-2 py-1.5 text-center">
      <p className="text-[9px] font-medium uppercase tracking-wide text-muted-2">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-foreground">{children}</p>
    </div>
  );
}

function EquityChart({ gold, reduce }: { gold: boolean; reduce: boolean }) {
  const color = gold ? "var(--color-accent)" : "var(--color-primary)";
  const id = gold ? "eq-gold" : "eq-blue";
  const line =
    "M2,52 L20,46 L38,49 L56,38 L74,41 L92,30 L110,33 L128,22 L146,16 L164,9 L178,5";
  const area = `${line} L178,60 L2,60 Z`;

  return (
    <svg
      viewBox="0 0 180 60"
      preserveAspectRatio="none"
      className="h-16 w-full rounded-lg border border-border bg-[#0a1020]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.4" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="var(--color-border)" strokeWidth="0.5" opacity="0.6">
        <line x1="0" y1="20" x2="180" y2="20" />
        <line x1="0" y1="40" x2="180" y2="40" />
      </g>
      <motion.path
        d={area}
        fill={`url(#${id})`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      <motion.circle
        cx="178"
        cy="5"
        r="3"
        fill={color}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: reduce ? 0 : 1.3 }}
      />
    </svg>
  );
}
