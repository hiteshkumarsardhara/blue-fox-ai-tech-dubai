"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { ArrowUpRight, Bot, Coins, TrendingUp } from "lucide-react";

/**
 * Premium "AI trading robot" hero visual — a sleek glossy-black humanoid
 * with orange energy glow (brand accent), floating among live trading HUD
 * cards. Honours prefers-reduced-motion.
 */
export function HeroRobot() {
  const reduce = useReducedMotion();

  const loop = (dur: number, delay = 0, dist = 12) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -dist, 0] },
          transition: { duration: dur, delay, repeat: Infinity, ease: "easeInOut" } as Transition,
        };

  const spin = (dur: number, dir: 1 | -1 = 1) =>
    reduce
      ? {}
      : {
          animate: { rotate: 360 * dir },
          transition: { duration: dur, repeat: Infinity, ease: "linear" } as Transition,
        };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* Ambient orange glow (pulsing) */}
      <motion.div
        className="absolute inset-0 grid place-items-center"
        {...(reduce
          ? {}
          : { animate: { opacity: [0.7, 1, 0.7] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } as Transition })}
      >
        <div className="h-[60%] w-[60%] rounded-full bg-accent/30 blur-[100px]" />
        <div className="absolute h-[38%] w-[38%] rounded-full bg-[#ff7a18]/30 blur-[70px]" />
      </motion.div>

      {/* HUD rings */}
      <motion.div className="absolute inset-[5%] rounded-full border border-dashed border-accent/25" {...spin(50, 1)} />
      <motion.div className="absolute inset-[16%] rounded-full border border-border-strong/50" {...spin(70, -1)} />

      {/* Robot */}
      <motion.div className="absolute inset-0 grid place-items-center" {...loop(6, 0, 16)}>
        <RobotSvg className="w-[64%] drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]" />
      </motion.div>

      {/* Floating trading HUD cards — each a different motion */}
      <motion.div className="absolute left-[-2%] top-[12%]" {...loop(4.6, 0.2, 13)}>
        <PriceCard />
      </motion.div>
      <motion.div className="absolute right-[-3%] top-[30%]" {...loop(5.6, 0.7, 15)}>
        <ChartCard />
      </motion.div>
      <motion.div className="absolute bottom-[14%] left-[1%]" {...loop(5.1, 1.1, 11)}>
        <ReturnBadge />
      </motion.div>
      <motion.div className="absolute bottom-[30%] right-[2%]" {...loop(4.2, 0.4, 10)}>
        <CoinChip />
      </motion.div>

      {!reduce && (
        <motion.div className="absolute inset-[9%]" {...spin(20, 1)}>
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_14px] shadow-accent" />
          <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#ff7a18] shadow-[0_0_12px] shadow-accent" />
        </motion.div>
      )}
    </div>
  );
}

/* ----------------------------- Floating cards ----------------------------- */

function PriceCard() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border-strong/70 bg-surface/85 px-3 py-2 shadow-xl backdrop-blur">
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
    <div className="rounded-xl border border-border-strong/70 bg-surface/85 p-3 shadow-xl backdrop-blur">
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
    <div className="flex items-center gap-2.5 rounded-xl border border-success/30 bg-success-soft/85 px-3 py-2 shadow-xl backdrop-blur">
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
    <div className="flex items-center gap-2 rounded-full border border-border-strong/70 bg-surface/85 px-3 py-1.5 shadow-xl backdrop-blur">
      <Coins className="h-4 w-4 text-accent" />
      <span className="text-xs font-semibold text-foreground">USDT deposit</span>
    </div>
  );
}

/* --------------------------- Premium robot SVG ---------------------------- */

function RobotSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bodyBlack" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#3a3f49" />
          <stop offset="0.42" stopColor="#15171c" />
          <stop offset="1" stopColor="#040406" />
        </linearGradient>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#23262d" />
          <stop offset="1" stopColor="#0a0b0e" />
        </linearGradient>
        <radialGradient id="core" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor="#fff4d8" />
          <stop offset="0.35" stopColor="#ffb347" />
          <stop offset="0.7" stopColor="#f2811e" />
          <stop offset="1" stopColor="#7a2e00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="visor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff7a18" />
          <stop offset="0.5" stopColor="#ffc24d" />
          <stop offset="1" stopColor="#ff7a18" />
        </linearGradient>
        <filter id="oglow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ---------- Shoulders / torso ---------- */}
      {/* Pauldrons */}
      <path d="M70 250c0-40 26-62 60-62v96c-30 0-60-2-60-34Z" fill="url(#bodyBlack)" stroke="#2a2e36" strokeWidth="1.5" />
      <path d="M210 250c0-40-26-62-60-62v96c30 0 60-2 60-34Z" fill="url(#bodyBlack)" stroke="#2a2e36" strokeWidth="1.5" />
      {/* Shoulder joints */}
      <circle cx="92" cy="214" r="9" fill="url(#panel)" stroke="#3a3f49" />
      <circle cx="92" cy="214" r="3.5" fill="var(--color-accent)" filter="url(#oglow)" />
      <circle cx="188" cy="214" r="9" fill="url(#panel)" stroke="#3a3f49" />
      <circle cx="188" cy="214" r="3.5" fill="var(--color-accent)" filter="url(#oglow)" />

      {/* Chest / torso plate */}
      <path d="M104 198c0-12 18-20 36-20s36 8 36 20l-4 116c0 10-14 16-32 16s-32-6-32-16l-4-116Z" fill="url(#bodyBlack)" stroke="#2a2e36" strokeWidth="1.5" />
      {/* Chest seams */}
      <path d="M140 184v140" stroke="#000" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M112 224h56M110 250h60M112 278h56" stroke="#000" strokeOpacity="0.45" strokeWidth="1.5" />

      {/* Energy lines from core */}
      <path d="M140 232 L116 214 M140 232 L164 214 M140 250 L118 264 M140 250 L162 264" stroke="var(--color-accent)" strokeWidth="1.5" strokeOpacity="0.7" filter="url(#oglow)" />

      {/* Reactor core */}
      <circle cx="140" cy="240" r="20" fill="#050507" stroke="#2a2e36" />
      <circle cx="140" cy="240" r="15" fill="url(#core)" filter="url(#oglow)" />
      <circle cx="140" cy="240" r="6" fill="#fff4d8" />

      {/* Abdomen glow segments */}
      <circle cx="140" cy="286" r="3" fill="var(--color-accent)" filter="url(#oglow)" />
      <circle cx="140" cy="300" r="2.5" fill="#ff7a18" filter="url(#oglow)" />

      {/* Vent slats */}
      <rect x="118" y="292" width="8" height="20" rx="3" fill="#000" fillOpacity="0.55" />
      <rect x="154" y="292" width="8" height="20" rx="3" fill="#000" fillOpacity="0.55" />

      {/* ---------- Neck ---------- */}
      <rect x="126" y="158" width="28" height="30" rx="8" fill="url(#panel)" stroke="#2a2e36" />
      <path d="M130 166h20M130 174h20" stroke="#000" strokeOpacity="0.4" strokeWidth="1.4" />

      {/* ---------- Head ---------- */}
      <path
        d="M140 44c30 0 50 22 52 54 1 20-6 36-18 46-9 7-21 10-34 10s-25-3-34-10c-12-10-19-26-18-46 2-32 22-54 52-54Z"
        fill="url(#bodyBlack)"
        stroke="#2a2e36"
        strokeWidth="1.5"
      />
      {/* Rim light */}
      <path d="M99 86c2-26 18-44 41-46" stroke="#cfd6e2" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
      {/* Crown seam */}
      <path d="M140 44v22M114 60c8-6 18-9 26-9s18 3 26 9" stroke="#000" strokeOpacity="0.45" strokeWidth="1.5" />

      {/* Visor */}
      <path
        d="M104 92c10-9 62-9 72 0 3 6 3 12 0 19-10 9-62 9-72 0-3-7-3-13 0-19Z"
        fill="url(#visor)"
        filter="url(#oglow)"
      />
      <path d="M110 95c10-6 50-6 60 0" stroke="#fff4d8" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="122" cy="102" r="4.5" fill="#fff4d8" />
      <circle cx="158" cy="102" r="4.5" fill="#fff4d8" />

      {/* Jaw / chin detail */}
      <path d="M126 138c8 5 20 5 28 0" stroke="#000" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />

      {/* Ear pods */}
      <path d="M90 96c-6 2-9 10-7 20l10-2-3-18Z" fill="url(#panel)" stroke="#2a2e36" />
      <path d="M190 96c6 2 9 10 7 20l-10-2 3-18Z" fill="url(#panel)" stroke="#2a2e36" />
      <circle cx="92" cy="108" r="2.5" fill="var(--color-accent)" filter="url(#oglow)" />
      <circle cx="188" cy="108" r="2.5" fill="var(--color-accent)" filter="url(#oglow)" />

      {/* Floating energy particles */}
      {[
        [96, 180], [184, 176], [120, 320], [160, 318], [104, 240], [176, 244], [132, 196], [148, 196],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 2 : 1.4} fill="var(--color-accent)" filter="url(#oglow)" />
      ))}
    </svg>
  );
}
