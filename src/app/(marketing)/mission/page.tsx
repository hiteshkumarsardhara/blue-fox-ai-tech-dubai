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
import { getTranslations } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "Our mission is to make advanced AI-driven trading technology accessible to investors through a simple, user-friendly platform.",
};

const PILLARS = [
  { icon: Users, titleKey: "marketing.mission.pillar1Title", textKey: "marketing.mission.pillar1Text" },
  { icon: BrainCircuit, titleKey: "marketing.mission.pillar2Title", textKey: "marketing.mission.pillar2Text" },
  { icon: Clock, titleKey: "marketing.mission.pillar3Title", textKey: "marketing.mission.pillar3Text" },
  { icon: Gauge, titleKey: "marketing.mission.pillar4Title", textKey: "marketing.mission.pillar4Text" },
];

const BENEFITS = [
  { icon: LineChart, titleKey: "marketing.mission.benefit1Title", textKey: "marketing.mission.benefit1Text" },
  { icon: ShieldCheck, titleKey: "marketing.mission.benefit2Title", textKey: "marketing.mission.benefit2Text" },
  { icon: Clock, titleKey: "marketing.mission.benefit3Title", textKey: "marketing.mission.benefit3Text" },
];

export default async function MissionPage() {
  const { t } = await getTranslations();
  return (
    <>
      <PageHero
        eyebrow={t("marketing.mission.heroEyebrow")}
        title={t("marketing.mission.heroTitle")}
        highlight={t("marketing.mission.heroHighlight")}
        icon={Target}
        lead={t("marketing.mission.heroLead")}
      />

      {/* The mission */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-muted">
            <Reveal>
              <p>{t("marketing.mission.intro1")}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                {t("marketing.mission.intro2a")} {site.name}{" "}
                {t("marketing.mission.intro2b")}
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
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">{t("marketing.mission.roleEyebrow")}</span>
              </div>
              <p className="mt-4 text-lg leading-relaxed text-foreground">
                {t("marketing.mission.roleLead")}
              </p>
              <p className="mt-3 leading-relaxed text-muted">
                {t("marketing.mission.roleTextA")}{" "}
                <span className="font-semibold text-foreground">{t("marketing.mission.roleNot")}</span>{" "}
                {t("marketing.mission.roleTextB")}
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
              eyebrow={t("marketing.mission.deliverEyebrow")}
              title={t("marketing.mission.deliverTitle")}
              subtitle={t("marketing.mission.deliverSubtitle")}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.titleKey} delay={(i % 4) * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft ring-1 ring-primary/30">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{t(p.titleKey)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{t(p.textKey)}</p>
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
            <SectionHeading eyebrow={t("marketing.mission.investorsEyebrow")} title={t("marketing.mission.investorsTitle")} />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.titleKey} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <b.icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-4 font-semibold text-foreground">{t(b.titleKey)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{t(b.textKey)}</p>
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
                  {t("marketing.mission.ctaTitle")}
                </h2>
                <p className="mt-2 text-muted">
                  {t("marketing.mission.ctaText")}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link href="/#packages" className={buttonVariants({ variant: "primary", size: "lg" })}>
                  {t("marketing.mission.ctaViewPackages")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/vision" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  <Eye className="h-4 w-4" /> {t("marketing.mission.ctaReadVision")}
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
