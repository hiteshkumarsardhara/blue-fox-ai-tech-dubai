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

export const metadata: Metadata = {
  title: "Our Vision",
  description:
    "Our vision is to democratize access to advanced automated trading technology for investors of all experience levels.",
};

const BARRIERS = [
  { icon: Unlock, title: "Beyond the experts", text: "Intelligent trading should not be limited to financial experts or large institutions — we open it to everyone." },
  { icon: Layers, title: "No complexity", text: "We remove the technical barriers of manual trading so you can participate without becoming an expert." },
  { icon: Globe2, title: "Available worldwide", text: "We aim to make advanced trading technology available to investors around the world." },
];

const FUTURE = [
  { icon: Lightbulb, title: "Innovation", text: "Robots built on advanced algorithms and continuously refined through rigorous testing and real-market analysis." },
  { icon: BadgeCheck, title: "Transparency", text: "Clear terms and an honest platform where you always understand how the technology works on your behalf." },
  { icon: Zap, title: "Automation", text: "Technology that works continuously for you — identifying opportunities and executing with speed and precision." },
  { icon: Lock, title: "Confidence", text: "A future where investors can confidently harness AI to take part in financial markets, 24/7." },
];

export default function VisionPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Vision"
        title="Democratize automated trading"
        highlight="for everyone"
        icon={Eye}
        lead="Our vision is to democratize access to advanced automated trading technology by enabling investors of all experience levels to participate in AI-driven investment solutions."
      />

      {/* The vision */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-muted">
            <Reveal>
              <p>
                We believe that intelligent trading should not be limited to
                financial experts or large institutions. By providing access to
                sophisticated AI-powered trading robots, we aim to remove
                traditional barriers and make advanced trading technology available
                to everyone.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                Our AI trading robots are developed using advanced algorithms and
                continuously refined through rigorous testing and real-market
                analysis. These systems autonomously monitor market conditions,
                identify opportunities, and execute trading strategies with speed
                and precision.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                We envision a future where investors can confidently harness the
                power of artificial intelligence to participate in financial markets
                without the complexity of manual trading. Through innovation,
                transparency, and automation, we strive to create a platform where
                technology works continuously on behalf of investors.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Removing barriers */}
      <section className="border-y border-border bg-surface/30 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Removing the barriers"
              title="Trading technology for everyone"
              subtitle="The traditional barriers to advanced trading — expertise, complexity and access — are exactly what we set out to remove."
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
              eyebrow="The future we're building"
              title="Innovation, transparency & automation"
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our commitment</p>
            <p className="mt-4 text-balance text-2xl font-medium leading-relaxed text-foreground sm:text-3xl">
              To empower individuals with cutting-edge AI technology — making
              automated trading more accessible, efficient, and convenient for
              investors worldwide.
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
                  Be part of the future of trading
                </h2>
                <p className="mt-2 text-muted">
                  Start with a package today, or read the mission behind our work.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
                  Start investing <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/mission" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  <Target className="h-4 w-4" /> Read our Mission
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
