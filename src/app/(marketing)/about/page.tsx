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
import { getTranslations } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Blue Fox AI Tech Solutions provides investors access to autonomous AI trading robots that analyze the markets and trade 24/7 — accessible, transparent and fully automated.",
};

export default async function AboutPage() {
  const { t } = await getTranslations();

  const QUICK_LINKS = [
    { label: t("marketing.about.quickLinkMission"), href: "/mission" },
    { label: t("marketing.about.quickLinkVision"), href: "/vision" },
    { label: t("marketing.about.quickLinkServices"), href: "/services" },
  ];

  const WHAT_WE_DO = [
    { icon: Cpu, title: t("marketing.about.whatWeDo1Title"), text: t("marketing.about.whatWeDo1Text") },
    { icon: Clock, title: t("marketing.about.whatWeDo2Title"), text: t("marketing.about.whatWeDo2Text") },
    { icon: Users, title: t("marketing.about.whatWeDo3Title"), text: t("marketing.about.whatWeDo3Text") },
    { icon: ShieldCheck, title: t("marketing.about.whatWeDo4Title"), text: t("marketing.about.whatWeDo4Text") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.2]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <Container className="relative py-16 sm:py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Badge tone="primary" className="mx-auto">
              <Sparkles className="h-3.5 w-3.5" /> {t("marketing.about.heroBadge")}
            </Badge>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {t("marketing.about.heroTitlePart1")} <span className="text-gradient">{t("marketing.about.heroTitleHighlight")}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              {t("marketing.about.heroSubtitle")}
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
                { v: "24/7", l: t("marketing.about.stat1Label") },
                { v: "100%", l: t("marketing.about.stat2Label") },
                { v: "AI", l: t("marketing.about.stat3Label") },
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("marketing.about.whoWeAreEyebrow")}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("marketing.about.whoWeAreTitle")}
              </h2>
              <div className="mt-5 space-y-4 text-muted">
                <p>
                  {t("marketing.about.whoWeAreP1Part1")}{" "}
                  <span className="text-foreground">{t("marketing.about.whoWeAreP1Highlight")}</span>{" "}
                  {t("marketing.about.whoWeAreP1Part2")}
                </p>
                <p>
                  {t("marketing.about.whoWeAreP2")}
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
                <h3 className="mt-5 text-xl font-semibold text-foreground">{t("marketing.about.missionCardTitle")}</h3>
                <p className="mt-2 leading-relaxed text-muted">
                  {t("marketing.about.missionCardText")}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {t("marketing.about.missionCardLink")}{" "}
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
                <h3 className="mt-5 text-xl font-semibold text-foreground">{t("marketing.about.visionCardTitle")}</h3>
                <p className="mt-2 leading-relaxed text-muted">
                  {t("marketing.about.visionCardText")}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  {t("marketing.about.visionCardLink")}{" "}
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
              eyebrow={t("marketing.about.valuesEyebrow")}
              title={t("marketing.about.valuesTitle")}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Rocket, title: t("marketing.about.value1Title"), text: t("marketing.about.value1Text") },
              { icon: ShieldCheck, title: t("marketing.about.value2Title"), text: t("marketing.about.value2Text") },
              { icon: Globe2, title: t("marketing.about.value3Title"), text: t("marketing.about.value3Text") },
              { icon: Clock, title: t("marketing.about.value4Title"), text: t("marketing.about.value4Text") },
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
                  {t("marketing.about.ctaTitle")}
                </h2>
                <p className="mt-4 text-muted">
                  {t("marketing.about.ctaText")} {site.location}.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
                    {t("marketing.about.ctaPrimary")} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/#packages" className={buttonVariants({ variant: "outline", size: "lg" })}>
                    {t("marketing.about.ctaSecondary")}
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
