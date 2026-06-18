/**
 * Central site configuration for Blue Fox Dubai.
 * Brand strings, navigation, contact details and sample catalogue data
 * live here so they can be edited in one place (and later sourced from
 * the database / CMS).
 */

export const site = {
  name: "Blue Fox Dubai",
  shortName: "Blue Fox",
  tagline: "Automated Forex Robots, Engineered in Dubai",
  description:
    "Blue Fox Dubai builds professional MetaTrader 4 & 5 trading robots (Expert Advisors) with verified live performance, account-locked licensing and 24/5 support.",
  url: "https://bluefoxdubai.com",
  email: "support@bluefoxdubai.com",
  phone: "+971 50 000 0000",
  whatsapp: "+971500000000",
  location: "Dubai, United Arab Emirates",
  riskWarning:
    "Trading Forex and CFDs is leveraged and carries a high level of risk to your capital. You can lose more than your initial deposit. Past performance is not an indication of future results. Only trade with money you can afford to lose.",
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Robots", href: "/robots" },
  { label: "Pricing", href: "/pricing" },
  { label: "Performance", href: "/performance" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Product",
    links: [
      { label: "All Robots", href: "/robots" },
      { label: "Pricing", href: "/pricing" },
      { label: "Live Performance", href: "/performance" },
      { label: "Free Trial", href: "/free-trial" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Client Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Client Portal", href: "/portal" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Risk Disclaimer", href: "/legal/risk-disclaimer" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Refund Policy", href: "/legal/refund" },
    ],
  },
];

/** Sample robot catalogue — replaced by DB data in later phases. */
export type Robot = {
  slug: string;
  name: string;
  tagline: string;
  platform: "MT4" | "MT5" | "MT4 & MT5";
  pairs: string;
  strategy: string;
  riskLevel: "Low" | "Medium" | "High";
  priceFrom: number;
  badge?: string;
  stats: { winRate: string; monthlyAvg: string; maxDrawdown: string; since: string };
};

export const robots: Robot[] = [
  {
    slug: "golden-fox",
    name: "Golden Fox",
    tagline: "Gold (XAUUSD) trend & breakout system",
    platform: "MT4 & MT5",
    pairs: "XAUUSD",
    strategy: "Trend / Breakout",
    riskLevel: "Medium",
    priceFrom: 299,
    badge: "Best seller",
    stats: { winRate: "78%", monthlyAvg: "8.4%", maxDrawdown: "14%", since: "2022" },
  },
  {
    slug: "night-prowler",
    name: "Night Prowler",
    tagline: "Low-risk scalper for Asian session",
    platform: "MT5",
    pairs: "EURUSD, GBPUSD",
    strategy: "Mean-reversion scalper",
    riskLevel: "Low",
    priceFrom: 199,
    badge: "Low risk",
    stats: { winRate: "84%", monthlyAvg: "4.9%", maxDrawdown: "7%", since: "2021" },
  },
  {
    slug: "apex-hunter",
    name: "Apex Hunter",
    tagline: "Multi-pair momentum for prop firms",
    platform: "MT4 & MT5",
    pairs: "Majors + Indices",
    strategy: "Momentum / News-safe",
    riskLevel: "High",
    priceFrom: 499,
    badge: "Prop-firm ready",
    stats: { winRate: "71%", monthlyAvg: "12.6%", maxDrawdown: "22%", since: "2023" },
  },
];

/** Sample pricing — replaced by DB Plan records later. */
export type Plan = {
  name: string;
  priceMonthly?: number;
  priceLifetime?: number;
  blurb: string;
  highlight?: boolean;
  features: string[];
  accounts: string;
};

export const plans: Plan[] = [
  {
    name: "Starter",
    priceMonthly: 49,
    priceLifetime: 299,
    accounts: "1 live + unlimited demo",
    blurb: "One robot, one trading account. Perfect to get started.",
    features: [
      "1 Expert Advisor of your choice",
      "1 live MT4/MT5 account",
      "Unlimited demo accounts",
      "Free updates & set files",
      "Email & WhatsApp support",
    ],
  },
  {
    name: "Trader",
    priceMonthly: 99,
    priceLifetime: 699,
    accounts: "3 live + unlimited demo",
    highlight: true,
    blurb: "Our most popular plan for active retail traders.",
    features: [
      "Any 2 Expert Advisors",
      "3 live MT4/MT5 accounts",
      "Unlimited demo accounts",
      "Priority support",
      "Free VPS setup guide",
      "30-day money-back guarantee",
    ],
  },
  {
    name: "Pro / Prop",
    priceMonthly: 249,
    priceLifetime: 1499,
    accounts: "10 live + unlimited demo",
    blurb: "For prop-firm traders and serious portfolios.",
    features: [
      "Full robot library access",
      "10 live MT4/MT5 accounts",
      "Unlimited demo accounts",
      "1-on-1 onboarding call",
      "Managed VPS option",
      "Dedicated account manager",
    ],
  },
];
