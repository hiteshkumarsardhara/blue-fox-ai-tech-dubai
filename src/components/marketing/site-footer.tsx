import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { footerNav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo height={44} />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.description}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-2" /> {site.location}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-2" /> {site.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-2" /> {site.phone}
              </li>
            </ul>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-2">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Full risk + earnings disclaimer */}
        <div className="mt-12 rounded-xl border border-border bg-background/60 p-5">
          <p className="text-xs leading-relaxed text-muted-2">
            <span className="font-semibold text-muted">Risk Disclaimer:</span>{" "}
            {site.riskWarning} Blue Fox Dubai provides trading software only — we
            do not manage funds, place trades on your behalf, or provide
            investment advice. All Expert Advisors run on your own broker account
            and are used at your own risk. Performance figures shown are historical
            and do not guarantee future results.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-2 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/legal/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/legal/refund" className="hover:text-foreground">
              Refunds
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
