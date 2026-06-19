"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { Check, Cpu, Sparkles, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/marketing/page-parts";
import { cn } from "@/lib/utils";

type Row = {
  img: string;
  aspect: string;
  side: "left" | "right";
  eyebrow: string;
  title: string;
  text: string;
  bullets: string[];
  tag: { icon: typeof Cpu; label: string };
};

const ROWS: Row[] = [
  {
    img: "/robots/ai-circuit.jpg",
    aspect: "aspect-[4/5]",
    side: "left",
    eyebrow: "Advanced AI",
    title: "Built on cutting-edge artificial intelligence",
    text: "Our trading robots run on sophisticated, continuously-refined algorithms that read market data and execute with speed and precision.",
    bullets: ["Self-improving algorithms", "Tested on real markets", "Pure data-driven decisions"],
    tag: { icon: Cpu, label: "AI-powered" },
  },
  {
    img: "/robots/finance.jpg",
    aspect: "aspect-[4/5]",
    side: "right",
    eyebrow: "Always working",
    title: "Putting your capital to work, 24/7",
    text: "While you go about your day, the robots monitor the markets around the clock and trade autonomously — no manual work required.",
    bullets: ["Trades 24 hours, 7 days", "Completely hands-free", "Monthly returns to your wallet"],
    tag: { icon: TrendingUp, label: "24/7 trading" },
  },
  {
    img: "/robots/analyzing-data.jpg",
    aspect: "aspect-[3/2]",
    side: "left",
    eyebrow: "Market intelligence",
    title: "Reading the markets in real time",
    text: "Multiple data streams analyzed simultaneously. The robots spot opportunities and adapt their strategies as conditions change.",
    bullets: ["Multi-pair analysis", "Adaptive strategies", "Risk-controlled execution"],
    tag: { icon: Sparkles, label: "Live analysis" },
  },
];

export function RobotShowcase() {
  const reduce = useReducedMotion();

  return (
    <section className="overflow-hidden py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="The robots in action"
          title="Meet the AI doing the work"
          subtitle="Real, autonomous trading robots — analyzing, deciding and executing so you don't have to."
        />

        <div className="mt-16 space-y-20 sm:space-y-24">
          {ROWS.map((row, i) => (
            <RobotRow key={i} row={row} reduce={!!reduce} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function RobotRow({ row, reduce }: { row: Row; reduce: boolean }) {
  const imgFirst = row.side === "left";
  const ease: Transition["ease"] = [0.22, 1, 0.36, 1];

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      {/* Image */}
      <motion.div
        className={cn("relative", imgFirst ? "lg:order-1" : "lg:order-2")}
        initial={reduce ? false : { opacity: 0, x: imgFirst ? -56 : 56 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.7, ease }}
      >
        <div
          className={cn(
            "pointer-events-none absolute -inset-5 rounded-[2.5rem] blur-3xl",
            imgFirst ? "bg-primary/15" : "bg-accent/15",
          )}
        />
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-border-strong/60 shadow-2xl"
          animate={reduce ? undefined : { y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={cn("group relative", row.aspect)}>
            <Image
              src={row.img}
              alt={row.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
            {/* floating tag */}
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border-strong/70 bg-background/70 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur">
              <row.tag.icon className="h-3.5 w-3.5 text-accent" /> {row.tag.label}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div
        className={cn(imgFirst ? "lg:order-2" : "lg:order-1")}
        initial={reduce ? false : { opacity: 0, x: imgFirst ? 56 : -56 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.7, delay: 0.1, ease }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {row.eyebrow}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{row.title}</h3>
        <p className="mt-4 leading-relaxed text-muted">{row.text}</p>
        <ul className="mt-5 space-y-2.5">
          {row.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-sm text-muted">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                <Check className="h-3 w-3" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
