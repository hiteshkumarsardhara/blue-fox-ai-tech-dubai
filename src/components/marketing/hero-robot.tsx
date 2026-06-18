"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { ArrowUpRight, Bot, Coins, TrendingUp } from "lucide-react";

/**
 * Animated "AI trading robot" hero visual.
 * A custom SVG robot floats while live-trading HUD cards orbit around it,
 * each with a distinct motion. Honours prefers-reduced-motion.
 */
export function HeroRobot() {
  const reduce = useReducedMotion();

  const loop = (dur: number, delay = 0, dist = 12) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -dist, 0] },
          transition: {
            duration: dur,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          } as Transition,
        };

  const spin = (dur: number, dir: 1 | -1 = 1) =>
    reduce
      ? {}
      : {
          animate: { rotate: 360 * dir },
          transition: { duration: dur, repeat: Infinity, ease: "linear" } as Transition,
        };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px]">
      {/* Ambient glow */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-[62%] w-[62%] rounded-full bg-primary/25 blur-[90px]" />
        <div className="absolute h-[40%] w-[40%] rounded-full bg-accent/15 blur-[70px]" />
      </div>

      {/* HUD rings */}
      <motion.div
        className="absolute inset-[6%] rounded-full border border-dashed border-primary/25"
        {...spin(46, 1)}
      />
      <motion.div
        className="absolute inset-[17%] rounded-full border border-border-strong/50"
        {...spin(64, -1)}
      />

      {/* Robot */}
      <motion.div className="absolute inset-0 grid place-items-center" {...loop(6, 0, 16)}>
        <RobotSvg className="w-[56%] drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]" />
      </motion.div>

      {/* Floating trading HUD cards — each a different motion */}
      <motion.div className="absolute left-[-2%] top-[12%]" {...loop(4.6, 0.2, 13)}>
        <PriceCard />
      </motion.div>

      <motion.div className="absolute right-[-3%] top-[30%]" {...loop(5.6, 0.7, 15)}>
        <ChartCard />
      </motion.div>

      <motion.div className="absolute bottom-[14%] left-[2%]" {...loop(5.1, 1.1, 11)}>
        <ReturnBadge />
      </motion.div>

      <motion.div className="absolute bottom-[28%] right-[4%]" {...loop(4.2, 0.4, 10)}>
        <CoinChip />
      </motion.div>

      {/* Orbiting node */}
      {!reduce && (
        <motion.div className="absolute inset-[10%]" {...spin(18, 1)}>
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px] shadow-accent" />
          <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px] shadow-primary" />
        </motion.div>
      )}
    </div>
  );
}

/* ----------------------------- Floating cards ----------------------------- */

function PriceCard() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border-strong/70 bg-surface/80 px-3 py-2 shadow-xl backdrop-blur">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
        <TrendingUp className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <p className="text-[11px] font-medium text-muted">XAU/USD · Gold</p>
        <p className="text-sm font-semibold text-foreground">
          2,415.30 <span className="text-success">▲ 1.24%</span>
        </p>
      </div>
    </div>
  );
}

function ChartCard() {
  const bars = [40, 62, 48, 78, 58, 88, 70, 96];
  return (
    <div className="rounded-xl border border-border-strong/70 bg-surface/80 p-3 shadow-xl backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-6">
        <span className="text-[11px] font-medium text-muted">Live P/L</span>
        <span className="flex items-center gap-0.5 text-[11px] font-semibold text-success">
          +8.4% <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
      <div className="flex h-12 items-end gap-1">
        {bars.map((h, i) => (
          <span
            key={i}
            className={`w-2 rounded-sm ${i === bars.length - 1 ? "bg-accent" : "bg-primary/70"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function ReturnBadge() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-success/30 bg-success-soft/80 px-3 py-2 shadow-xl backdrop-blur">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-success/20 text-success">
        <Bot className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <p className="text-[11px] font-medium text-muted">Robot return</p>
        <p className="text-sm font-semibold text-success">+8.4% / mo</p>
      </div>
    </div>
  );
}

function CoinChip() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border-strong/70 bg-surface/80 px-3 py-1.5 shadow-xl backdrop-blur">
      <Coins className="h-4 w-4 text-accent" />
      <span className="text-xs font-semibold text-foreground">USDT deposit</span>
    </div>
  );
}

/* ------------------------------- Robot SVG -------------------------------- */

function RobotSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 264"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f7fc" />
          <stop offset="0.55" stopColor="#c4cedd" />
          <stop offset="1" stopColor="#92a0b6" />
        </linearGradient>
        <linearGradient id="metalDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfd8e6" />
          <stop offset="1" stopColor="#7e8ba3" />
        </linearGradient>
        <radialGradient id="eye" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#bfe0ff" />
          <stop offset="0.5" stopColor="var(--color-primary)" />
          <stop offset="1" stopColor="#0b3a78" />
        </radialGradient>
      </defs>

      {/* Antenna */}
      <line x1="110" y1="14" x2="110" y2="34" stroke="#9aa6bd" strokeWidth="4" strokeLinecap="round" />
      <circle cx="110" cy="11" r="6" fill="var(--color-accent)" />

      {/* Ears */}
      <rect x="40" y="92" width="14" height="40" rx="7" fill="url(#metalDark)" />
      <rect x="166" y="92" width="14" height="40" rx="7" fill="url(#metalDark)" />
      <circle cx="47" cy="112" r="3.5" fill="var(--color-primary)" />
      <circle cx="173" cy="112" r="3.5" fill="var(--color-primary)" />

      {/* Head */}
      <rect x="52" y="34" width="116" height="104" rx="36" fill="url(#metal)" stroke="#e9eef7" strokeWidth="1.5" />
      {/* sheen */}
      <ellipse cx="86" cy="60" rx="26" ry="12" fill="#ffffff" opacity="0.35" />

      {/* Visor */}
      <rect x="66" y="62" width="88" height="50" rx="25" fill="#0a1120" />
      <rect x="66" y="62" width="88" height="50" rx="25" fill="none" stroke="var(--color-primary)" strokeOpacity="0.4" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="92" cy="87" r="10" fill="url(#eye)" />
      <circle cx="128" cy="87" r="10" fill="url(#eye)" />
      <circle cx="92" cy="87" r="10" fill="none" stroke="#bfe0ff" strokeOpacity="0.5" />
      <circle cx="128" cy="87" r="10" fill="none" stroke="#bfe0ff" strokeOpacity="0.5" />

      {/* Neck */}
      <rect x="96" y="132" width="28" height="18" rx="6" fill="url(#metalDark)" />

      {/* Body */}
      <rect x="46" y="146" width="128" height="104" rx="32" fill="url(#metal)" stroke="#e9eef7" strokeWidth="1.5" />
      <ellipse cx="80" cy="168" rx="30" ry="11" fill="#ffffff" opacity="0.3" />

      {/* Chest screen */}
      <rect x="78" y="168" width="64" height="50" rx="12" fill="#0a1120" />
      {/* mini chart */}
      <polyline
        points="86,206 98,196 108,201 118,186 130,192 138,178"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="138" cy="178" r="3" fill="var(--color-accent)" />

      {/* Shoulder lights */}
      <circle cx="60" cy="232" r="4" fill="var(--color-accent)" opacity="0.9" />
      <circle cx="160" cy="232" r="4" fill="var(--color-primary)" opacity="0.9" />
    </svg>
  );
}
