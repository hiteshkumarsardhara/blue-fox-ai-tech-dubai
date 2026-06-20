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
import { getTranslations } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Autonomous AI trading robots, simple deposits & withdrawals, and fixed-term packages with monthly returns — fully managed from your client portal.",
};

const OFFERINGS = [
  { icon: BrainCircuit, titleKey: "offering1Title", textKey: "offering1Text" },
  { icon: LineChart, titleKey: "offering2Title", textKey: "offering2Text" },
  { icon: Wallet, titleKey: "offering3Title", textKey: "offering3Text" },
];

const FEATURES = [
  { icon: Clock, titleKey: "feature1" },
  { icon: LineChart, titleKey: "feature2" },
  { icon: ShieldCheck, titleKey: "feature3" },
  { icon: Gauge, titleKey: "feature4" },
  { icon: Wallet, titleKey: "feature5" },
  { icon: Sparkles, titleKey: "feature6" },
];

export default async function ServicesPage() {
  const { t } = await getTranslations();
  return (
    <>
      <PageHero
        eyebrow={t("marketing.services.heroEyebrow")}
        title={t("marketing.services.heroTitle")}
        highlight={t("marketing.services.heroHighlight")}
        icon={BrainCircuit}
        lead={t("marketing.services.heroLead")}
      />

      {/* What we offer */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t("marketing.services.offerEyebrow")}
              title={t("marketing.services.offerTitle")}
              subtitle={t("marketing.services.offerSubtitle")}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {OFFERINGS.map((o, i) => (
              <Reveal key={o.titleKey} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft ring-1 ring-primary/30">
                    <o.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{t(`marketing.services.${o.titleKey}`)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{t(`marketing.services.${o.textKey}`)}</p>
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
              eyebrow={t("marketing.services.howEyebrow")}
              title={t("marketing.services.howTitle")}
              subtitle={`${t("marketing.services.howSubtitlePrefix")} $${REGISTRATION_FEE} ${t("marketing.services.howSubtitleSuffix")}`}
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
              eyebrow={t("marketing.services.packagesEyebrow")}
              title={t("marketing.services.packagesTitle")}
              subtitle={t("marketing.services.packagesSubtitle")}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border border-accent/40 bg-surface p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 text-accent">
                    <Crown className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{t("marketing.services.goldenTitle")}</h3>
                </div>
                <p className="mt-3 text-sm text-muted">
                  {t("marketing.services.goldenText1")} <span className="font-semibold text-foreground">$3,333</span> {t("marketing.services.goldenText2")}{" "}
                  <span className="font-semibold text-foreground">$9,999</span>{t("marketing.services.goldenText3")}
                  <span className="font-semibold text-accent"> 4% – 5.5% </span> {t("marketing.services.goldenText4")}
                </p>
                <Link href="/#packages" className={buttonVariants({ variant: "outline", size: "md", className: "mt-5 w-fit" })}>
                  {t("marketing.services.goldenCta")} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-primary/40 bg-surface p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
                    <Gem className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{t("marketing.services.diamondTitle")}</h3>
                </div>
                <p className="mt-3 text-sm text-muted">
                  {t("marketing.services.diamondText1")} <span className="font-semibold text-foreground">$11,111</span> {t("marketing.services.diamondText2")}{" "}
                  <span className="font-semibold text-foreground">$55,555</span>{t("marketing.services.diamondText3")}
                  <span className="font-semibold text-primary"> 6% – 8% </span> {t("marketing.services.diamondText4")}
                </p>
                <Link href="/#packages" className={buttonVariants({ variant: "outline", size: "md", className: "mt-5 w-fit" })}>
                  {t("marketing.services.diamondCta")} <ArrowRight className="h-4 w-4" />
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("marketing.services.fundingEyebrow")}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("marketing.services.fundingTitle")}
              </h2>
              <p className="mt-4 text-muted">
                {t("marketing.services.fundingText")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: Bitcoin, labelKey: "fundingMethod1" },
                  { icon: Building2, labelKey: "fundingMethod2" },
                  { icon: Banknote, labelKey: "fundingMethod3" },
                ].map((m) => (
                  <span key={m.labelKey} className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm font-medium text-foreground">
                    <m.icon className="h-4 w-4 text-primary" /> {t(`marketing.services.${m.labelKey}`)}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid gap-3 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <div key={f.titleKey} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                      <f.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{t(`marketing.services.${f.titleKey}`)}</span>
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
                  {t("marketing.services.ctaTitle")}
                </h2>
                <p className="mt-4 text-muted">
                  {t("marketing.services.ctaText")}
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/#packages" className={buttonVariants({ variant: "primary", size: "lg" })}>
                    {t("marketing.services.ctaPrimary")} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
                    {t("marketing.services.ctaSecondary")}
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
