"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bot,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/i18n-provider";

const LINKS = [
  { href: "/portal", label: "Dashboard", tKey: "portalNav.dashboard", icon: LayoutDashboard },
  { href: "/portal/deposit", label: "Deposit", tKey: "portalNav.deposit", icon: ArrowDownToLine },
  { href: "/portal/invest", label: "Invest", tKey: "portalNav.invest", icon: Bot },
  { href: "/portal/withdraw", label: "Withdraw", tKey: "portalNav.withdraw", icon: ArrowUpFromLine },
  { href: "/portal/kyc", label: "Verify", tKey: "portalNav.verify", icon: ShieldCheck },
  { href: "/portal/referrals", label: "Referrals", tKey: "portalNav.referrals", icon: Gift },
  { href: "/portal/transactions", label: "Transactions", tKey: "portalNav.transactions", icon: Receipt },
];

export function PortalNav() {
  const { t } = useTranslations();
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary-soft text-primary"
                : "text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            <l.icon className="h-4 w-4" />
            {t(l.tKey)}
          </Link>
        );
      })}
    </nav>
  );
}
