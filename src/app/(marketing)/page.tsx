import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Bitcoin,
  Building2,
  Gauge,
  LineChart,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { RobotCard, VerifiedNote } from "@/components/marketing/robot-card";
import { robots, howItWorks, site, REGISTRATION_FEE } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <Container className="relative py-20 sm:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Badge tone="primary" className="mx-auto">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Forex Robots · Dubai
            </Badge>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              Let AI forex robots{" "}
              <span className="text-gradient">grow your capital</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Deposit your funds, rent a Blue Fox trading robot, and earn a
              monthly return paid straight to your wallet. Withdraw anytime in
              crypto, bank transfer or cash — fully managed, fully transparent.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Start investing <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/robots" className={buttonVariants({ variant: "outline", size: "lg" })}>
                View the robots
              </Link>
            </div>
            <div className="mt-6">
              <VerifiedNote />
            </div>
          </Reveal>

          {/* Animated stat strip */}
          <Reveal delay={0.15}>
            <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
              {[
                { node: <CountUp value={12.4} decimals={1} prefix="$" suffix="M" />, label: "Assets managed" },
                { node: <CountUp value={2400} suffix="+" />, label: "Active investors" },
                { node: <CountUp value={6} suffix="%" />, label: "Avg. monthly return" },
                { node: <CountUp value={4.8} decimals={1} prefix="$" suffix="M" />, label: "Paid to clients" },
              ].map((s) => (
                <div key={s.label} className="bg-surface px-5 py-6 text-center">
                  <p className="text-2xl font-semibold text-foreground sm:text-3xl">{s.node}</p>
                  <p className="mt-1 text-xs font-medium text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <p className="mt-3 text-center text-[11px] text-muted-2">
            Figures are illustrative. Returns come from live forex trading and are
            not guaranteed. Capital is at risk.
          </p>
        </Container>
      </section>

      {/* ──────────────────── Deposit / withdraw methods ──────────────────── */}
      <section className="border-y border-border bg-surface/30">
        <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-7 text-sm text-muted-2">
          <span className="text-xs uppercase tracking-widest">Deposit &amp; withdraw with</span>
          {[
            { icon: Bitcoin, label: "Crypto (USDT/USDC)" },
            { icon: Building2, label: "Bank transfer" },
            { icon: Banknote, label: "Cash payout" },
            { icon: Wallet, label: "Instant wallet" },
          ].map((t) => (
            <span key={t.label} className="flex items-center gap-1.5 font-medium text-muted">
              <t.icon className="h-4 w-4 text-primary" /> {t.label}
            </span>
          ))}
        </Container>
      </section>

      {/* ─────────────────────── Robots ─────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Our robots"
              title="Pick a robot, set your term, earn monthly"
              subtitle="Each robot is live-traded by Blue Fox. Choose the risk level that suits you and lock in an 18 or 24-month contract."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {robots.map((robot, i) => (
              <Reveal key={robot.slug} delay={i * 0.1}>
                <RobotCard robot={robot} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/robots" className={buttonVariants({ variant: "ghost", size: "md" })}>
              Compare all robots <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ───────────────────────── How it works ──────────────────────── */}
      <section id="how-it-works" className="border-y border-border bg-surface/30 py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="From sign-up to monthly income in 4 steps"
              subtitle={`A one-time $${REGISTRATION_FEE} registration fee, then deposit and start earning. Everything is managed from your client portal.`}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {howItWorks.map((step, i) => {
              const Icon = [UserPlus, Wallet, Gauge, Banknote][i];
              return (
                <Reveal key={step.title} delay={i * 0.1}>
                  <div className="h-full rounded-2xl border border-border bg-surface p-6">
                    <div className="flex items-center justify-between">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft ring-1 ring-primary/30">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-3xl font-semibold text-border-strong">
                        {i + 1}
                      </span>
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

      {/* ────────────────────────── Why us ───────────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Why Blue Fox"
              title="Managed, transparent, and built on real trading"
              subtitle="No spreadsheets, no MetaTrader setup. We run the robots — you watch your wallet grow."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: LineChart, title: "Monthly returns", text: "A clear monthly return — fixed floor plus performance upside — credited to your wallet every month." },
              { icon: Wallet, title: "Withdraw your way", text: "Cash out in crypto, bank transfer or cash. Request from the portal; our team handles the rest." },
              { icon: ShieldCheck, title: "Verified trading", text: "Robot performance is tracked on MyFXBook/FXBlue. We invest your capital through live forex markets." },
              { icon: Lock, title: "Fixed-term contracts", text: "18 or 24-month contracts give the strategy room to compound. You always see your term progress." },
              { icon: Gauge, title: "Risk you choose", text: "From conservative to aggressive — pick the robot that matches your appetite and minimum deposit." },
              { icon: Sparkles, title: "Full client portal", text: "Deposit, invest, track earnings, refer friends and withdraw — all from one modern dashboard." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <f.icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────────────── Testimonials ───────────────────────── */}
      <section className="border-y border-border bg-surface/30 py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Trusted by investors" title="What our clients say" />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Rashid A.", role: "Investor · Dubai", quote: "Deposited in USDT, chose Golden Fox, and my monthly return hits my wallet on time. Withdrew to cash twice without issues." },
              { name: "Elena V.", role: "Investor · EU", quote: "I love that I don't have to touch MetaTrader. The dashboard shows exactly what I earn each month." },
              { name: "James O.", role: "Investor · UK", quote: "Started small on Night Prowler to test it. Support answered on WhatsApp fast. Now on a 24-month contract." },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, n) => (
                      <Star key={n} className="h-4 w-4 fill-current" />
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
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────────────── Final CTA ─────────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center sm:px-12">
              <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Put your capital to work
                </h2>
                <p className="mt-4 text-muted">
                  Register in minutes, deposit, and let a Blue Fox robot trade for
                  you. {site.location}.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
                    Create your account <ArrowRight className="h-4 w-4" />
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
