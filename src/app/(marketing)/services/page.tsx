import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Bitcoin,
  BrainCircuit,
  Building2,
  Clock,
  Crown,
  Gauge,
  Gem,
  LineChart,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";
import { PageHero, SectionHeading } from "@/components/marketing/page-parts";
import { howItWorks, REGISTRATION_FEE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Autonomous AI trading robots, simple deposits & withdrawals, and fixed-term packages with monthly returns — fully managed from your client portal.",
};

const OFFERINGS = [
  { icon: BrainCircuit, title: "AI Trading Robots", text: "Autonomous Expert-Advisor robots that analyze the markets and trade 24/7 — no manual work for you." },
  { icon: LineChart, title: "Monthly Returns", text: "Each package pays a fixed monthly ROI credited straight to your wallet throughout the contract." },
  { icon: Wallet, title: "Simple Deposits & Withdrawals", text: "Fund in crypto or bank, and withdraw in crypto, bank or cash — reviewed and processed by our team." },
];

const FEATURES = [
  { icon: Clock, title: "24/7 automated trading" },
  { icon: LineChart, title: "Fixed monthly ROI" },
  { icon: ShieldCheck, title: "Verified live performance" },
  { icon: Gauge, title: "Risk-controlled strategies" },
  { icon: Wallet, title: "Crypto / bank / cash payouts" },
  { icon: Sparkles, title: "Full client portal" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="AI trading robots that"
        highlight="work for you"
        icon={BrainCircuit}
        lead="From your first deposit to your monthly withdrawal, everything is managed from one simple platform. You choose a package — our robots do the trading."
      />

      {/* What we offer */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What we offer"
              title="A complete AI-investing service"
              subtitle="We provide the technology platform; the robots operate autonomously. You stay in control of your funds and decisions."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {OFFERINGS.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft ring-1 ring-primary/30">
                    <o.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{o.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{o.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="From sign-up to monthly income in 4 steps"
              subtitle={`A one-time $${REGISTRATION_FEE} registration fee, then deposit and start earning — all from your client portal.`}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {howItWorks.map((step, i) => {
              const Icon = [UserPlus, Wallet, Gauge, Banknote][i];
              return (
                <Reveal key={step.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-border bg-surface p-6">
                    <div className="flex items-center justify-between">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft ring-1 ring-primary/30">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-3xl font-semibold text-border-strong">{i + 1}</span>
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Packages summary */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Our packages"
              title="Two tiers, eight robots"
              subtitle="Pick the tier that matches your budget and timeline. Capital is returned in 3 parts over the 3 months after your term."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border border-accent/40 bg-surface p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 text-accent">
                    <Crown className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Golden Packages</h3>
                </div>
                <p className="mt-3 text-sm text-muted">
                  18-month contracts from <span className="font-semibold text-foreground">$3,333</span> to{" "}
                  <span className="font-semibold text-foreground">$9,999</span>, with a fixed
                  <span className="font-semibold text-accent"> 4% – 5.5% </span> monthly ROI.
                </p>
                <Link href="/#packages" className={buttonVariants({ variant: "outline", size: "md", className: "mt-5 w-fit" })}>
                  View Golden bots <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-primary/40 bg-surface p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
                    <Gem className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Diamond Packages</h3>
                </div>
                <p className="mt-3 text-sm text-muted">
                  24-month contracts from <span className="font-semibold text-foreground">$11,111</span> to{" "}
                  <span className="font-semibold text-foreground">$55,555</span>, with a fixed
                  <span className="font-semibold text-primary"> 6% – 8% </span> monthly ROI.
                </p>
                <Link href="/#packages" className={buttonVariants({ variant: "outline", size: "md", className: "mt-5 w-fit" })}>
                  View Diamond bots <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Deposit / withdraw + features */}
      <section className="border-y border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Funding</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Deposit and withdraw, your way
              </h2>
              <p className="mt-4 text-muted">
                Top up your wallet by crypto or bank transfer. When you want to cash
                out, request a withdrawal in crypto, bank or cash — our team reviews
                and processes every request securely.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: Bitcoin, label: "Crypto (USDT/USDC)" },
                  { icon: Building2, label: "Bank transfer" },
                  { icon: Banknote, label: "Cash payout" },
                ].map((m) => (
                  <span key={m.label} className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm font-medium text-foreground">
                    <m.icon className="h-4 w-4 text-primary" /> {m.label}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid gap-3 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <div key={f.title} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                      <f.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{f.title}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center sm:px-12">
              <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Start with the right package
                </h2>
                <p className="mt-4 text-muted">
                  Register in minutes, deposit, and let a Blue Fox robot trade for
                  you 24/7.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/#packages" className={buttonVariants({ variant: "primary", size: "lg" })}>
                    View packages <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
                    Talk to us
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
