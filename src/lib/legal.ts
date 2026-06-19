import { site, REGISTRATION_FEE } from "@/lib/site";

export type LegalBlock = string | { list: string[] };
export type LegalSection = { id: string; title: string; blocks: LegalBlock[] };
export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const LEGAL_UPDATED = "19 June 2026";

/**
 * NOTE: These are professionally-structured TEMPLATES tailored to the Blue Fox
 * business model. They are NOT legal advice and MUST be reviewed and approved
 * by a UAE-qualified lawyer before launch.
 */

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  updated: LEGAL_UPDATED,
  intro: `${site.name} ("we", "us", "our") respects your privacy. This Privacy Policy explains what personal data we collect, how we use and protect it, and the rights you have when you use our website and platform.`,
  sections: [
    {
      id: "information-we-collect",
      title: "1. Information We Collect",
      blocks: [
        "We collect information you provide and information generated automatically when you use the platform:",
        {
          list: [
            "Identity & contact data — name, email, phone/WhatsApp, country and address.",
            "Verification (KYC) data — government ID, proof of address and related documents where required by law.",
            "Financial data — deposit and withdrawal details, wallet addresses, bank/payment information and transaction history.",
            "Account data — login credentials, package selections, contract details and support messages.",
            "Technical data — IP address, device and browser information, and usage analytics collected via cookies.",
          ],
        },
      ],
    },
    {
      id: "how-we-use",
      title: "2. How We Use Your Information",
      blocks: [
        "We use your information to:",
        {
          list: [
            "Create and manage your account and verify your identity (KYC/AML).",
            "Process deposits, allocate funds to your chosen package, credit returns and process withdrawals.",
            "Provide customer support and send service, security and transactional notifications.",
            "Operate, secure, maintain and improve the platform and prevent fraud.",
            "Comply with legal, regulatory and tax obligations.",
          ],
        },
      ],
    },
    {
      id: "sharing",
      title: "3. How We Share Information",
      blocks: [
        "We do not sell your personal data. We may share it with:",
        {
          list: [
            "Service providers — payment processors, KYC/identity providers, hosting, email and analytics partners, under confidentiality obligations.",
            "Regulators and authorities — where required by applicable law, court order or to prevent fraud and financial crime.",
            "Professional advisers — auditors, lawyers and insurers where reasonably necessary.",
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: "4. Cookies & Tracking",
      blocks: [
        "We use cookies and similar technologies to keep you signed in, remember preferences, secure the platform and understand usage. You can control cookies through your browser settings; disabling some cookies may affect functionality.",
      ],
    },
    {
      id: "security",
      title: "5. Data Security",
      blocks: [
        "We apply technical and organisational measures — including encryption of sensitive fields, access controls and monitoring — to protect your data. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      id: "retention",
      title: "6. Data Retention",
      blocks: [
        "We retain your information for as long as your account is active and thereafter for as long as required to meet legal, tax, accounting and regulatory obligations, after which it is securely deleted or anonymised.",
      ],
    },
    {
      id: "international-transfers",
      title: "7. International Transfers",
      blocks: [
        "Your data may be processed in countries outside your own. Where it is transferred internationally, we take steps to ensure an appropriate level of protection consistent with applicable data-protection laws.",
      ],
    },
    {
      id: "your-rights",
      title: "8. Your Rights",
      blocks: [
        "Subject to applicable law, you may have the right to access, correct, delete or restrict the processing of your data, to object to certain processing, and to request a copy of your data. To exercise these rights, contact us using the details below.",
      ],
    },
    {
      id: "childrens-privacy",
      title: "9. Children's Privacy",
      blocks: [
        "The platform is intended only for adults (18+). We do not knowingly collect data from minors. If we learn that we have, we will delete it.",
      ],
    },
    {
      id: "changes",
      title: "10. Changes to This Policy",
      blocks: [
        "We may update this Privacy Policy from time to time. Material changes will be posted on this page with an updated date. Continued use of the platform means you accept the revised policy.",
      ],
    },
    {
      id: "contact",
      title: "11. Contact Us",
      blocks: [
        `For privacy questions or to exercise your rights, contact us at ${site.email} or ${site.phone} — ${site.location}.`,
      ],
    },
  ],
};

export const termsOfService: LegalDoc = {
  title: "Terms & Conditions",
  updated: LEGAL_UPDATED,
  intro: `These Terms & Conditions ("Terms") govern your use of ${site.name} and our AI trading-robot platform. By creating an account or using the platform, you agree to these Terms. If you do not agree, do not use the platform.`,
  sections: [
    {
      id: "eligibility",
      title: "1. Eligibility",
      blocks: [
        "You must be at least 18 years old and legally able to enter into a binding contract. You are responsible for ensuring that using the platform is lawful in your jurisdiction.",
      ],
    },
    {
      id: "accounts",
      title: "2. Account & Registration",
      blocks: [
        `Registration requires a one-time fee of $${REGISTRATION_FEE} and completion of identity verification (KYC). You must provide accurate information, keep your credentials confidential, and you are responsible for all activity under your account.`,
      ],
    },
    {
      id: "our-service",
      title: "3. Our Service",
      blocks: [
        "We provide access to autonomous AI trading robots and the technology platform that lets you allocate funds to them. The robots operate automatically according to their programmed algorithms.",
        "We do NOT provide discretionary investment management, personalised investment advice, or brokerage services. You decide which package to participate in; the robots operate autonomously.",
      ],
    },
    {
      id: "packages",
      title: "4. Packages & Contracts",
      blocks: [
        "Each package has a fixed deposit amount, a stated monthly return (ROI) and a fixed contract term of 18 months (Golden) or 24 months (Diamond).",
        "Returns shown are targets generated by live trading and are not guaranteed. Your principal is committed for the contract term. After the term ends, capital is returned in 3 equal parts over the following 3 months.",
      ],
    },
    {
      id: "deposits-withdrawals",
      title: "5. Deposits & Withdrawals",
      blocks: [
        "Deposits can be made by crypto (USDT/USDC), bank transfer or other supported methods, and are credited to your wallet after we confirm them.",
        "Withdrawals can be requested in crypto, bank transfer or cash and are reviewed and processed by our team. We may apply verification checks, limits and processing times, and may decline requests where required by law or our policies.",
      ],
    },
    {
      id: "fees",
      title: "6. Fees",
      blocks: [
        `Applicable fees include the one-time $${REGISTRATION_FEE} registration fee and any network, processing or withdrawal fees disclosed at the time of the transaction.`,
      ],
    },
    {
      id: "risk-disclosure",
      title: "7. Risk Disclosure",
      blocks: [
        "Trading in forex and related instruments carries a high level of risk. Returns are generated by live trading and are NOT guaranteed, NOT bank deposits, and NOT guaranteed by any authority. You may lose part or all of your invested capital. Past performance does not indicate future results. Only participate with funds you can afford to lose.",
      ],
    },
    {
      id: "kyc-aml",
      title: "8. KYC & Anti-Money-Laundering",
      blocks: [
        "We operate KYC and AML procedures. You agree to provide verification documents on request. We may freeze, delay or reverse transactions and report activity to authorities where we suspect fraud, money laundering or other illegal conduct.",
      ],
    },
    {
      id: "prohibited",
      title: "9. Prohibited Activities",
      blocks: [
        "You must not use the platform for unlawful purposes, provide false information, use funds from illegal sources, attempt to disrupt or gain unauthorised access to the platform, or use it on behalf of a sanctioned person or jurisdiction.",
      ],
    },
    {
      id: "intellectual-property",
      title: "10. Intellectual Property",
      blocks: [
        `All software, trading robots, content, branding and trademarks on the platform are owned by ${site.name} or its licensors. You receive a limited, non-transferable right to use the platform and may not copy, modify, distribute or reverse-engineer any part of it.`,
      ],
    },
    {
      id: "termination",
      title: "11. Suspension & Termination",
      blocks: [
        "We may suspend or terminate your account if you breach these Terms, provide false information, or where required by law. Contractual obligations relating to active contracts and lawful balances will be handled in accordance with these Terms and applicable law.",
      ],
    },
    {
      id: "liability",
      title: "12. Limitation of Liability",
      blocks: [
        "To the maximum extent permitted by law, we are not liable for trading losses, indirect or consequential damages, or losses arising from market conditions, third-party services, or events beyond our reasonable control. Nothing in these Terms excludes liability that cannot be excluded by law.",
      ],
    },
    {
      id: "governing-law",
      title: "13. Governing Law",
      blocks: [
        `These Terms are governed by the laws of the United Arab Emirates, and the courts of ${site.location} have jurisdiction, subject to any mandatory consumer protections.`,
      ],
    },
    {
      id: "changes",
      title: "14. Changes to These Terms",
      blocks: [
        "We may update these Terms from time to time. Changes are effective when posted on this page with an updated date. Continued use of the platform means you accept the revised Terms.",
      ],
    },
    {
      id: "contact",
      title: "15. Contact Us",
      blocks: [
        `Questions about these Terms? Contact us at ${site.email} or ${site.phone} — ${site.location}.`,
      ],
    },
  ],
};
