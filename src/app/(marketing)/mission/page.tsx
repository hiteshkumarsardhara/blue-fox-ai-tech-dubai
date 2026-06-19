import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Clock,
  Eye,
  Gauge,
  LineChart,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";
import { PageHero, SectionHeading } from "@/components/marketing/page-parts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "Our mission is to make advanced AI-driven trading technology accessible to investors through a simple, user-friendly platform.",
};

const PILLARS = [
  { icon: Users, title: "Accessible to all", text: "A simple, user-friendly platform that removes the complexity of trading so anyone can participate." },
  { icon: BrainCircuit, title: "Autonomous robots", text: "AI-powered trading robots that analyze market data, identify opportunities and execute trades on their own." },
  { icon: Clock, title: "Around the clock", text: "Systems that continuously monitor markets and operate 24 hours a day, 7 days a week." },
  { icon: Gauge, title: "Adaptive strategies", text: "Sophisticated algorithms that adapt their approach to changing market conditions in pursuit of optimal performance." },
];

const BENEFITS = [
  { icon: LineChart, title: "Data-driven, not emotional", text: "Every decision is based on data and algorithms — never fear, greed or guesswork." },
  { icon: ShieldCheck, title: "You stay in control", text: "You choose your package and allocate funds. We provide the technology; we don't manage discretionary money." },
  { icon: Clock, title: "Your time, freed up", text: "No charts to watch and no manual trading — the robots work while you go about your day." },
];

export default function MissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Mission"
        title="Make advanced AI trading"
        highlight="accessible to everyone"
        icon={Target}
        lead="Our mission is to make advanced AI-driven trading technology accessible to investors through a user-friendly AI Trading Bots platform."
      />

      {/* The mission */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-muted">
            <Reveal>
              <p>
                We provide access to autonomous AI-powered trading robots designed
                to analyze market data, identify trading opportunities, and execute
                trades around the clock. Using sophisticated algorithms and
                automated decision-making, these systems continuously monitor
                market conditions and adapt their strategies to pursue optimal
                performance.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                By leveraging cutting-edge artificial intelligence and automated
                trading technology, {site.name} aims to simplify participation in
                financial markets and provide investors with access to intelligent,
                data-driven trading solutions operating 24 hours a day, 7 days a
                week.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Our role / boundary */}
      <section className="border-y border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <Reveal className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-primary/30 bg-primary-soft/30 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Our role</span>
              </div>
              <p className="mt-4 text-lg leading-relaxed text-foreground">
                Our role is to provide the technology platform that enables clients
                to allocate funds to these AI trading solutions.
              </p>
              <p className="mt-3 leading-relaxed text-muted">
                We do <span className="font-semibold text-foreground">not</span>{" "}
                provide discretionary investment management services. Instead,
                investors choose to participate in AI-driven trading strategies
                through our platform, while the trading robots operate autonomously
                according to their programmed algorithms.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* How we deliver */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How we deliver"
              title="Four principles behind every robot"
              subtitle="The mission comes to life through the way our technology is built and operated."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 4) * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft ring-1 ring-primary/30">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* What it means for investors */}
      <section className="border-y border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="For investors" title="What our mission means for you" />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <b.icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-4 font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-border bg-surface px-6 py-10 text-center sm:px-10 lg:flex-row lg:text-left">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Ready to put the mission to work?
                </h2>
                <p className="mt-2 text-muted">
                  Explore our packages or read the vision driving everything we do.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link href="/#packages" className={buttonVariants({ variant: "primary", size: "lg" })}>
                  View packages <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/vision" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  <Eye className="h-4 w-4" /> Read our Vision
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
