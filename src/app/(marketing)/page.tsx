import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Bitcoin,
  Building2,
  Crown,
  Gauge,
  Gem,
  LineChart,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserPlus,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { HeroVideo } from "@/components/marketing/hero-video";
import { HeroRobot } from "@/components/marketing/hero-robot";
import { RobotShowcase } from "@/components/marketing/robot-showcase";
import { PackageCard } from "@/components/marketing/package-card";
import {
  packages,
  goldenPackages,
  diamondPackages,
  howItWorks,
  site,
  REGISTRATION_FEE,
  capitalReturnNote,
} from "@/lib/site";
import { formatUSD } from "@/lib/utils";
import { getTranslations } from "@/lib/i18n";

export default async function HomePage() {
  const { t } = await getTranslations();
  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative isolate overflow-hidden">
        {/* Live forex/trading video background */}
        <div className="absolute inset-0 -z-10">
          <HeroVideo className="h-full w-full object-cover" />
          {/* Readability overlays */}
          <div className="absolute inset-0 bg-background/65" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/40" />
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        </div>
        <Container className="relative py-14 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
            {/* Left: copy + CTA + reviews + plans */}
            <Reveal>
              <Badge tone="primary">
                <Sparkles className="h-3.5 w-3.5" /> {t("hero.eyebrow")}
              </Badge>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {t("hero.title1")}{" "}
                <span className="text-gradient">{t("hero.title2")}</span>
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {t("hero.subtitle")}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-[#3f7fe0] to-accent px-7 text-sm font-semibold text-white shadow-[0_12px_34px_-8px] shadow-primary/60 transition-transform hover:scale-[1.02]"
                >
                  {t("hero.ctaPrimary")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/#packages" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  {t("hero.ctaSecondary")}
                </Link>
              </div>

              {/* Reviews */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-foreground">{t("home.reviewsExcellent")}</span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="grid h-5 w-5 place-items-center rounded-[3px] bg-success">
                      <Star className="h-3.5 w-3.5 fill-white text-white" />
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted">
                  {t("home.reviewsRated")} <span className="font-semibold text-foreground">4.8/5</span> {t("home.reviewsOn")}{" "}
                  <span className="font-semibold text-success">Trustpilot</span>
                </span>
              </div>

              {/* Plans / packages card */}
              <div className="mt-7 max-w-md rounded-2xl border border-border bg-surface/70 p-4 backdrop-blur">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-2">
                  {t("home.popularPackages")}
                </p>
                <ul className="space-y-2.5">
                  {[packages[0], packages[3], packages[7]].map((p) => (
                    <li key={p.slug} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2.5">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-soft text-primary">
                          <TrendingUp className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm font-medium text-foreground">{p.name}</span>
                      </span>
                      <span className="text-xs text-muted">
                        {formatUSD(p.deposit)} · {p.monthlyRoi}% / mo
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Right: animated AI trading robot */}
            <Reveal delay={0.15} className="mx-auto w-full">
              <HeroRobot />
            </Reveal>
          </div>

          {/* Animated stat strip */}
          <Reveal delay={0.2}>
            <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
              {[
                { id: "assetsManaged", node: <CountUp value={12.4} decimals={1} prefix="$" suffix="M" />, label: t("home.statAssetsManaged") },
                { id: "activeInvestors", node: <CountUp value={2400} suffix="+" />, label: t("home.statActiveInvestors") },
                { id: "avgMonthlyReturn", node: <CountUp value={6} suffix="%" />, label: t("home.statAvgMonthlyReturn") },
                { id: "paidToClients", node: <CountUp value={4.8} decimals={1} prefix="$" suffix="M" />, label: t("home.statPaidToClients") },
              ].map((s) => (
                <div key={s.id} className="bg-surface px-5 py-5 text-center">
                  <p className="text-2xl font-semibold text-foreground sm:text-3xl">{s.node}</p>
                  <p className="mt-1 text-xs font-medium text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <p className="mt-3 text-center text-[11px] text-muted-2">
            {t("home.statsDisclaimer")}
          </p>
        </Container>
      </section>

      {/* ──────────────────── Deposit / withdraw methods ──────────────────── */}
      <section className="border-y border-border bg-surface/30">
        <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-7 text-sm text-muted-2">
          <span className="text-xs uppercase tracking-widest">{t("home.depositWithdrawWith")}</span>
          {[
            { id: "crypto", icon: Bitcoin, label: t("home.methodCrypto") },
            { id: "bank", icon: Building2, label: t("home.methodBankTransfer") },
            { id: "cash", icon: Banknote, label: t("home.methodCashPayout") },
            { id: "wallet", icon: Wallet, label: t("home.methodInstantWallet") },
          ].map((m) => (
            <span key={m.id} className="flex items-center gap-1.5 font-medium text-muted">
              <m.icon className="h-4 w-4 text-primary" /> {m.label}
            </span>
          ))}
        </Container>
      </section>

      {/* ─────────────────────── Packages ─────────────────────── */}
      <section id="packages" className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t("home.packagesEyebrow")}
              title={t("home.packagesTitle")}
              subtitle={`${t("home.packagesSubtitlePre")} $${REGISTRATION_FEE} ${t("home.packagesSubtitlePost")}`}
            />
          </Reveal>

          {/* Golden tier */}
          <Reveal>
            <div className="mt-12">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Crown className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t("home.goldenPackages")}</h3>
                  <p className="text-xs text-muted">{t("home.goldenSubtitle")}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {goldenPackages.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.06}>
                    <PackageCard pkg={p} />
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Diamond tier */}
          <Reveal>
            <div className="mt-14">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Gem className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t("home.diamondPackages")}</h3>
                  <p className="text-xs text-muted">{t("home.diamondSubtitle")}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {diamondPackages.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.06}>
                    <PackageCard pkg={p} />
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-muted-2">
            {capitalReturnNote} {t("home.packagesRiskNote")}
          </p>
        </Container>
      </section>

      {/* ───────────────────────── How it works ──────────────────────── */}
      <section id="how-it-works" className="border-y border-border bg-surface/30 py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t("home.howEyebrow")}
              title={t("home.howTitle")}
              subtitle={`${t("home.howSubtitlePre")} $${REGISTRATION_FEE} ${t("home.howSubtitlePost")}`}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {howItWorks.map((step, i) => {
              const Icon = [UserPlus, Wallet, Gauge, Banknote][i];
              return (
                <Reveal key={step.tKey} delay={i * 0.1}>
                  <div className="h-full rounded-2xl border border-border bg-surface p-6">
                    <div className="flex items-center justify-between">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft ring-1 ring-primary/30">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-3xl font-semibold text-border-strong">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{t(`home.${step.tKey}Title`)}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{t(`home.${step.tKey}Desc`)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ──────────── Robots in action (image showcase) ──────────── */}
      <RobotShowcase />

      {/* ────────────────────────── Why us ───────────────────────────── */}
      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t("home.whyEyebrow")}
              title={t("home.whyTitle")}
              subtitle={t("home.whySubtitle")}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { id: "fixedRoi", icon: LineChart, title: t("home.whyFixedRoiTitle"), text: t("home.whyFixedRoiText") },
              { id: "withdraw", icon: Wallet, title: t("home.whyWithdrawTitle"), text: t("home.whyWithdrawText") },
              { id: "verified", icon: ShieldCheck, title: t("home.whyVerifiedTitle"), text: t("home.whyVerifiedText") },
              { id: "fixedTerm", icon: Lock, title: t("home.whyFixedTermTitle"), text: t("home.whyFixedTermText") },
              { id: "everyBudget", icon: Gauge, title: t("home.whyEveryBudgetTitle"), text: t("home.whyEveryBudgetText") },
              { id: "portal", icon: Sparkles, title: t("home.whyPortalTitle"), text: t("home.whyPortalText") },
            ].map((f, i) => (
              <Reveal key={f.id} delay={(i % 3) * 0.08}>
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
            <SectionHeading eyebrow={t("home.testimonialsEyebrow")} title={t("home.testimonialsTitle")} />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { id: "rashid", name: "Rashid A.", role: t("home.testimonial1Role"), quote: t("home.testimonial1Quote") },
              { id: "elena", name: "Elena V.", role: t("home.testimonial2Role"), quote: t("home.testimonial2Quote") },
              { id: "james", name: "James O.", role: t("home.testimonial3Role"), quote: t("home.testimonial3Quote") },
            ].map((r, i) => (
              <Reveal key={r.id} delay={i * 0.1}>
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, n) => (
                      <Star key={n} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                    “{r.quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-border pt-4">
                    <p className="text-sm font-medium text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-2">{r.role}</p>
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
                  {t("home.ctaTitle")}
                </h2>
                <p className="mt-4 text-muted">
                  {t("home.ctaSubtitle")} {site.location}.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
                    {t("home.ctaCreateAccount")} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
                    {t("home.ctaTalkToUs")}
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
