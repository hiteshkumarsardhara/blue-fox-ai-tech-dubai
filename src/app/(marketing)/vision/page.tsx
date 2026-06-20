import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  Globe2,
  Layers,
  Lightbulb,
  Lock,
  Target,
  Unlock,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button";
import { PageHero, SectionHeading } from "@/components/marketing/page-parts";
import { site } from "@/lib/site";
import { getTranslations } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Our Vision",
  description:
    "Our vision is to democratize access to advanced automated trading technology for investors of all experience levels.",
};

export default async function VisionPage() {
  const { t } = await getTranslations();

  const BARRIERS = [
    { icon: Unlock, title: t("marketing.vision.barrier1Title"), text: t("marketing.vision.barrier1Text") },
    { icon: Layers, title: t("marketing.vision.barrier2Title"), text: t("marketing.vision.barrier2Text") },
    { icon: Globe2, title: t("marketing.vision.barrier3Title"), text: t("marketing.vision.barrier3Text") },
  ];

  const FUTURE = [
    { icon: Lightbulb, title: t("marketing.vision.future1Title"), text: t("marketing.vision.future1Text") },
    { icon: BadgeCheck, title: t("marketing.vision.future2Title"), text: t("marketing.vision.future2Text") },
    { icon: Zap, title: t("marketing.vision.future3Title"), text: t("marketing.vision.future3Text") },
    { icon: Lock, title: t("marketing.vision.future4Title"), text: t("marketing.vision.future4Text") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("marketing.vision.heroEyebrow")}
        title={t("marketing.vision.heroTitle")}
        highlight={t("marketing.vision.heroHighlight")}
        icon={Eye}
        lead={t("marketing.vision.heroLead")}
      />

      {/* The vision */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-muted">
            <Reveal>
              <p>{t("marketing.vision.intro1")}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>{t("marketing.vision.intro2")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>{t("marketing.vision.intro3")}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Removing barriers */}
      <section className="border-y border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t("marketing.vision.barriersEyebrow")}
              title={t("marketing.vision.barriersTitle")}
              subtitle={t("marketing.vision.barriersSubtitle")}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {BARRIERS.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 ring-1 ring-accent/30">
                    <b.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* The future we're building */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t("marketing.vision.futureEyebrow")}
              title={t("marketing.vision.futureTitle")}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FUTURE.map((f, i) => (
              <Reveal key={f.title} delay={(i % 4) * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <f.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Commitment band */}
      <section className="border-y border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t("marketing.vision.commitmentEyebrow")}</p>
            <p className="mt-4 text-balance text-2xl font-medium leading-relaxed text-foreground sm:text-3xl">
              {t("marketing.vision.commitmentText")}
            </p>
            <p className="mt-4 text-sm text-muted-2">— {site.name}</p>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-border bg-surface px-6 py-10 text-center sm:px-10 lg:flex-row lg:text-left">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {t("marketing.vision.ctaTitle")}
                </h2>
                <p className="mt-2 text-muted">
                  {t("marketing.vision.ctaText")}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
                  {t("marketing.vision.ctaPrimary")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/mission" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  <Target className="h-4 w-4" /> {t("marketing.vision.ctaSecondary")}
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
