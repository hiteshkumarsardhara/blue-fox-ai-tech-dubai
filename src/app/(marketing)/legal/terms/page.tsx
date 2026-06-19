import type { Metadata } from "next";
import { LegalShell } from "@/components/marketing/legal-shell";
import { termsOfService } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms governing your use of ${site.name} and our AI trading-robot platform.`,
};

export default function TermsPage() {
  return <LegalShell doc={termsOfService} />;
}
