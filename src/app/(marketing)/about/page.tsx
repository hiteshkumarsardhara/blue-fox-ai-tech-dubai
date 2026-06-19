import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Cpu,
  Eye,
  Globe2,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Blue Fox AI Tech Solutions provides investors access to autonomous AI trading robots that analyze the markets and trade 24/7 — accessible, transparent and fully automated.",
};

const SUB_NAV = [
  { label: "About", href: "#about" },
  { label: "Mission", href: "#mission" },
  { label: "Vision", href: "#vision" },
];

const VALUES = [
  { icon: Cpu, title: "AI-Powered Algorithms", text: "Sophisticated, continuously-refined algorithms analyze the markets and execute with speed and precision." },
  { icon: Clock, title: "24/7 Autonomous", text: "The robots monitor conditions and trade around the clock — no manual intervention required." },
  { icon: Users, title: "Accessible to Everyone", text: "Advanced trading technology for investors of all levels — not just experts or institutions." },
  { icon: ShieldCheck, title: "Transparent & Automated", text: "You allocate funds; the robots operate autonomously by their programmed strategy. We don't manage discretionary funds." },
];

export default function AboutPage() {
  return (
    <>
      {/* ─────────────── Hero / intro ─────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.25]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <Container className="relative py-16 sm:py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Badge tone="primary" className="mx-auto">
              <Sparkles className="h-3.5 w-3.5" /> About Blue Fox AI Tech Solutions
            </Badge>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              The future of trading is{" "}
              <span className="text-gradient">autonomous</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Welcome to Blue Fox AI Tech Solutions, where we are transforming the
              future of trading through advanced AI-powered trading robots.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {SUB_NAV.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="rounded-full border border-border-strong bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {[
                { v: "24/7", l: "Always-on trading" },
                { v: "100%", l: "Automated" },
                { v: "AI", l: "Data-driven" },
              ].map((s) => (
                <div key={s.l} className="bg-surface px-4 py-6 text-center">
                  <p className="text-2xl font-semibold text-foreground sm:text-3xl">{s.v}</p>
                  <p className="mt-1 text-xs font-medium text-muted">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─────────────── About Us ─────────────── */}
      <section id="about" className="scroll-mt-24 py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Who we are</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Not a traditional trading platform
              </h2>
              <div className="mt-5 space-y-4 text-muted">
                <p>
                  We are not a traditional trading platform. Instead, we provide
                  investors with access to <span className="text-foreground">autonomous AI trading robots</span> that
                  operate 24/7 on their behalf.
                </p>
                <p>
                  These intelligent systems are designed with sophisticated
                  algorithms capable of analyzing market conditions, executing
                  trades, and making data-driven decisions aimed at maximizing
                  investment growth — all without requiring constant user
                  involvement.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid gap-4 sm:grid-cols-2">
                {VALUES.map((v) => (
                  <div key={v.title} className="rounded-2xl border border-border bg-surface p-5">
                    <v.icon className="h-6 w-6 text-accent" />
                    <h3 className="mt-3 text-sm font-semibold text-foreground">{v.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{v.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ─────────────── Mission ─────────────── */}
      <section id="mission" className="scroll-mt-24 border-y border-border bg-surface/30 py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft ring-1 ring-primary/30">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Mission</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Make advanced AI trading accessible to everyone
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-5 text-base leading-relaxed text-muted">
                <p>
                  Our mission is to make advanced AI-driven trading technology
                  accessible to investors through a user-friendly AI Trading Bots
                  platform.
                </p>
                <p>
                  We provide access to autonomous AI-powered trading robots
                  designed to analyze market data, identify trading opportunities,
                  and execute trades around the clock. Using sophisticated
                  algorithms and automated decision-making, these systems
                  continuously monitor market conditions and adapt their strategies
                  to pursue optimal performance.
                </p>
                <p className="rounded-xl border border-border bg-background/60 p-4 text-sm text-muted">
                  <span className="font-semibold text-foreground">Our role</span> is
                  to provide the technology platform that enables clients to
                  allocate funds to these AI trading solutions. We do{" "}
                  <span className="font-semibold text-foreground">not</span> provide
                  discretionary investment management services. Investors choose to
                  participate in AI-driven trading strategies through our platform,
                  while the trading robots operate autonomously according to their
                  programmed algorithms.
                </p>
                <p>
                  By leveraging cutting-edge artificial intelligence and automated
                  trading technology, Blue Fox AI Tech Solutions aims to simplify
                  participation in financial markets and provide investors with
                  access to intelligent, data-driven trading solutions operating 24
                  hours a day, 7 days a week.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ─────────────── Vision ─────────────── */}
      <section id="vision" className="scroll-mt-24 py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 ring-1 ring-accent/30">
                  <Eye className="h-6 w-6 text-accent" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our Vision</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Democratize automated trading for all
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-5 text-base leading-relaxed text-muted">
                <p>
                  Our vision is to democratize access to advanced automated trading
                  technology by enabling investors of all experience levels to
                  participate in AI-driven investment solutions.
                </p>
                <p>
                  We believe that intelligent trading should not be limited to
                  financial experts or large institutions. By providing access to
                  sophisticated AI-powered trading robots, we aim to remove
                  traditional barriers and make advanced trading technology
                  available to everyone.
                </p>
                <p>
                  Our AI trading robots are developed using advanced algorithms and
                  continuously refined through rigorous testing and real-market
                  analysis. These systems autonomously monitor market conditions,
                  identify opportunities, and execute trading strategies with speed
                  and precision.
                </p>
                <p>
                  We envision a future where investors can confidently harness the
                  power of artificial intelligence to participate in financial
                  markets without the complexity of manual trading. Through
                  innovation, transparency, and automation, we strive to create a
                  platform where technology works continuously on behalf of
                  investors.
                </p>
                <p>
                  Our commitment is to empower individuals with cutting-edge AI
                  technology, making automated trading more accessible, efficient,
                  and convenient for investors worldwide.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ─────────────── Values ─────────────── */}
      <section className="border-y border-border bg-surface/30 py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What we stand for</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Innovation, transparency &amp; automation
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Rocket, title: "Innovation", text: "Cutting-edge AI and automated trading technology, always improving." },
              { icon: ShieldCheck, title: "Transparency", text: "Clear terms — you stay in control of your funds and decisions." },
              { icon: Globe2, title: "Accessibility", text: "Designed for investors worldwide, whatever their experience level." },
              { icon: Clock, title: "Always On", text: "Intelligent systems working for you 24 hours a day, 7 days a week." },
            ].map((v, i) => (
              <Reveal key={v.title} delay={(i % 4) * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <v.icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-4 font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center sm:px-12">
              <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Let AI trade for you
                </h2>
                <p className="mt-4 text-muted">
                  Join Blue Fox and put cutting-edge AI trading robots to work on
                  your capital — 24/7. {site.location}.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
                    Start investing <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/#packages" className={buttonVariants({ variant: "outline", size: "lg" })}>
                    View packages
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
