import type { Metadata } from "next";
import { LegalShell } from "@/components/marketing/legal-shell";
import { privacyPolicy } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects your personal data.`,
};

export default function PrivacyPage() {
  return <LegalShell doc={privacyPolicy} />;
}
