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
import { SectionHeading } from "@/components/marketing/page-parts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Blue Fox AI Tech Solutions provides investors access to autonomous AI trading robots that analyze the markets and trade 24/7 — accessible, transparent and fully automated.",
};

const QUICK_LINKS = [
  { label: "Our Mission", href: "/mission" },
  { label: "Our Vision", href: "/vision" },
  { label: "Our Services", href: "/services" },
];

const WHAT_WE_DO = [
  { icon: Cpu, title: "AI-Powered Algorithms", text: "Sophisticated, continuously-refined algorithms analyze the markets and execute with speed and precision." },
  { icon: Clock, title: "24/7 Autonomous", text: "The robots monitor conditions and trade around the clock — no manual intervention required." },
  { icon: Users, title: "Accessible to Everyone", text: "Advanced trading technology for investors of all levels — not just experts or institutions." },
  { icon: ShieldCheck, title: "Transparent & Automated", text: "You allocate funds; the robots operate autonomously. We don't manage discretionary money." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.2]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <Container className="relative py-16 sm:py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Badge tone="primary" className="mx-auto">
              <Sparkles className="h-3.5 w-3.5" /> About Blue Fox AI Tech Solutions
            </Badge>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              The future of trading is <span className="text-gradient">autonomous</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Welcome to Blue Fox AI Tech Solutions, where we are transforming the
              future of trading through advanced AI-powered trading robots.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {QUICK_LINKS.map((s) => (
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

      {/* Who we are */}
      <section className="py-16 sm:py-24">
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
                  investors with access to{" "}
                  <span className="text-foreground">autonomous AI trading robots</span>{" "}
                  that operate 24/7 on their behalf.
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
                {WHAT_WE_DO.map((v) => (
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

      {/* Mission & Vision teasers */}
      <section className="border-y border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <Link
                href="/mission"
                className="group block h-full rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-primary/40"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft ring-1 ring-primary/30">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">Our Mission</h3>
                <p className="mt-2 leading-relaxed text-muted">
                  To make advanced AI-driven trading technology accessible to
                  investors through a simple, user-friendly platform.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Read our mission{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
            <Reveal delay={0.08}>
              <Link
                href="/vision"
                className="group block h-full rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-accent/40"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 ring-1 ring-accent/30">
                  <Eye className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">Our Vision</h3>
                <p className="mt-2 leading-relaxed text-muted">
                  To democratize access to advanced automated trading for investors
                  of all experience levels, worldwide.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Read our vision{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What we stand for"
              title="Innovation, transparency & automation"
            />
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

      {/* CTA */}
      <section className="border-t border-border py-16 sm:py-24">
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
