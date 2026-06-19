import type { ComponentType, ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

type IconType = ComponentType<{ className?: string }>;

/** Standard page hero — eyebrow badge, gradient title, lead paragraph. */
export function PageHero({
  eyebrow,
  title,
  highlight,
  lead,
  icon: Icon = Sparkles,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  highlight?: string;
  lead?: string;
  icon?: IconType;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.2]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
      <Container className="relative py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Badge tone="primary" className="mx-auto">
            <Icon className="h-3.5 w-3.5" /> {eyebrow}
          </Badge>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
            {highlight && (
              <>
                {" "}
                <span className="text-gradient">{highlight}</span>
              </>
            )}
          </h1>
          {lead && (
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              {lead}
            </p>
          )}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}

/** Centered section heading. */
export function SectionHeading({
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
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted">{subtitle}</p>}
    </div>
  );
}
