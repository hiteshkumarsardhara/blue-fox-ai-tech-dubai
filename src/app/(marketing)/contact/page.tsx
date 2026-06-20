import type { Metadata } from "next";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/marketing/contact-form";
import { site } from "@/lib/site";
import { getTranslations } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${site.name}. Email, phone, WhatsApp, or send us a message — our team replies within 24 hours.`,
};

export default async function ContactPage() {
  const { t } = await getTranslations();
  const whatsappHref = `https://wa.me/${site.whatsapp.replace(/[^\d]/g, "")}`;

  const channels = [
    { icon: Mail, id: "Email", label: t("marketing.contact.channelEmail"), value: site.email, href: `mailto:${site.email}` },
    { icon: Phone, id: "Phone", label: t("marketing.contact.channelPhone"), value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { icon: MessageCircle, id: "WhatsApp", label: t("marketing.contact.channelWhatsApp"), value: site.phone, href: whatsappHref },
    { icon: MapPin, id: "Office", label: t("marketing.contact.channelOffice"), value: site.location, href: undefined },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <Container className="relative py-16 sm:py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge tone="primary" className="mx-auto">
              <Sparkles className="h-3.5 w-3.5" /> {t("marketing.contact.heroEyebrow")}
            </Badge>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {t("marketing.contact.heroTitlePrefix")}{" "}
              <span className="text-gradient">{t("marketing.contact.heroTitleHighlight")}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              {t("marketing.contact.heroSubtitleBefore")} {site.location}{" "}
              {t("marketing.contact.heroSubtitleAfter")}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Contact info + form */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Left: channels */}
            <Reveal>
              <div className="space-y-3">
                {channels.map((c) => {
                  const inner = (
                    <>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-medium uppercase tracking-wide text-muted-2">
                          {c.label}
                        </span>
                        <span className="block truncate text-sm font-medium text-foreground">
                          {c.value}
                        </span>
                      </span>
                    </>
                  );
                  return c.href ? (
                    <a
                      key={c.id}
                      href={c.href}
                      target={c.id === "WhatsApp" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3.5 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div
                      key={c.id}
                      className="flex items-center gap-3.5 rounded-xl border border-border bg-surface p-4"
                    >
                      {inner}
                    </div>
                  );
                })}

                <div className="flex items-center gap-3.5 rounded-xl border border-border bg-surface p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                    <Clock className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-muted-2">
                      {t("marketing.contact.supportHoursLabel")}
                    </span>
                    <span className="block text-sm font-medium text-foreground">
                      {t("marketing.contact.supportHoursValue")}
                    </span>
                  </span>
                </div>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm font-semibold text-success transition-colors hover:bg-success/20"
                >
                  <MessageCircle className="h-4 w-4" /> {t("marketing.contact.chatOnWhatsApp")}
                </a>
              </div>
            </Reveal>

            {/* Right: form */}
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
