import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Cpu,
  Download,
  Gauge,
  KeyRound,
  LineChart,
  Lock,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { RobotCard, VerifiedNote } from "@/components/marketing/robot-card";
import { PricingCard } from "@/components/marketing/pricing-card";
import { robots, plans, site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <Container className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge tone="primary" className="mx-auto">
              <Sparkles className="h-3.5 w-3.5" /> MT4 &amp; MT5 Expert Advisors
            </Badge>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              Automated forex robots,{" "}
              <span className="text-gradient">engineered in Dubai</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Blue Fox builds disciplined, rules-based trading robots for
              MetaTrader 4 &amp; 5. Verified live performance, account-locked
              licensing, and a 30-day money-back guarantee. Your robot runs on
              your account — you stay in control.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/robots" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Explore the robots <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/free-trial" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Start free trial
              </Link>
            </div>
            <div className="mt-6">
              <VerifiedNote />
            </div>
          </div>

          {/* Stat strip */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {[
              { label: "Avg. monthly return", value: "8.4%", sub: "across live accounts" },
              { label: "Active traders", value: "2,400+", sub: "in 40+ countries" },
              { label: "Years of data", value: "4+", sub: "of verified history" },
              { label: "Uptime", value: "99.9%", sub: "licensing service" },
            ].map((s) => (
              <div key={s.label} className="bg-surface px-5 py-6 text-center">
                <p className="text-2xl font-semibold text-foreground sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-muted">{s.label}</p>
                <p className="text-[11px] text-muted-2">{s.sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-2">
            Performance shown is historical and varies by broker, spread and risk
            settings. Past performance is not indicative of future results.
          </p>
        </Container>
      </section>

      {/* ──────────────────── Trust / compatibility ──────────────────── */}
      <section className="border-y border-border bg-surface/30">
        <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-7 text-sm text-muted-2">
          <span className="text-xs uppercase tracking-widest">Works with</span>
          {["MetaTrader 4", "MetaTrader 5", "Any MT broker", "VPS-ready", "FTMO & prop firms"].map(
            (t) => (
              <span key={t} className="flex items-center gap-1.5 font-medium text-muted">
                <PlugZap className="h-4 w-4 text-primary" /> {t}
              </span>
            ),
          )}
        </Container>
      </section>

      {/* ─────────────────────── Featured robots ─────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="The fleet"
            title="Robots built for real market conditions"
            subtitle="Each Expert Advisor is forward-tested on live accounts before release. Pick one that matches your risk appetite."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {robots.map((robot) => (
              <RobotCard key={robot.slug} robot={robot} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/robots" className={buttonVariants({ variant: "ghost", size: "md" })}>
              View all robots <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ───────────────────────── How it works ──────────────────────── */}
      <section id="how-it-works" className="border-y border-border bg-surface/30 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="From checkout to auto-trading in minutes"
            subtitle="No coding. No managed accounts. You install the robot on your own MetaTrader terminal and it does the rest."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { icon: Bot, title: "1. Choose a robot", text: "Pick the EA that fits your pairs and risk level." },
              { icon: KeyRound, title: "2. Get your licence", text: "We email a licence key the moment your payment clears." },
              { icon: Cpu, title: "3. Bind your account", text: "Lock the licence to your MT4/MT5 account number." },
              { icon: Download, title: "4. Download & run", text: "Install the EA on your terminal or VPS — it auto-trades 24/5." },
            ].map((step) => (
              <div key={step.title} className="rounded-2xl border border-border bg-surface p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft ring-1 ring-primary/30">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ────────────────────────── Why us ───────────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Why Blue Fox"
            title="Software you control, performance you can verify"
            subtitle="We sell trading software — not signals, not managed funds. That keeps you in full control of your capital."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Verified live results", text: "Every robot links to a read-only MyFXBook/FXBlue account. No screenshots, no faked numbers." },
              { icon: Lock, title: "Account-locked licensing", text: "Your licence binds to your MT4/MT5 account number, with unlimited demo accounts for testing." },
              { icon: Gauge, title: "Built-in risk controls", text: "Configurable lot sizing, drawdown limits and news filters — trade your way." },
              { icon: LineChart, title: "Transparent drawdown", text: "We publish max drawdown openly. Honest expectations, fewer surprises." },
              { icon: PlugZap, title: "VPS & broker friendly", text: "Runs on any MT broker and any VPS. We provide setup guides and support." },
              { icon: KeyRound, title: "Self-service portal", text: "Manage licences, swap accounts, download updates and invoices anytime." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-surface p-6">
                <f.icon className="h-6 w-6 text-accent" />
                <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ────────────────────────── Pricing ──────────────────────────── */}
      <section className="border-y border-border bg-surface/30 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Lifetime licence or monthly — your call"
            subtitle="Buy once and own it forever, or subscribe monthly. Every plan includes free updates and our 30-day money-back guarantee."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-2">
            Need something custom for your prop firm or fund?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Talk to us
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* ──────────────────────── Testimonials ───────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Trusted by traders"
            title="What our clients say"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Rashid A.", role: "Retail trader · Dubai", quote: "Golden Fox has been running on my VPS for 8 months. The verified results were exactly what convinced me — and they held up." },
              { name: "Elena V.", role: "Prop-firm trader · EU", quote: "Apex Hunter passed my FTMO challenge on the first try. The risk settings are genuinely flexible." },
              { name: "James O.", role: "Part-time trader · UK", quote: "Setup support over WhatsApp was fast. Licence bound to my account in minutes and I was live the same day." },
            ].map((t) => (
              <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-surface p-6">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-2">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────────────── Final CTA ─────────────────────────── */}
      <section className="pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Put your trading on autopilot
              </h2>
              <p className="mt-4 text-muted">
                Start with a free trial robot, or go live today with a 30-day
                money-back guarantee. {site.location}.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
                  Create your account <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  Book a demo
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-muted">{subtitle}</p>}
    </div>
  );
}
