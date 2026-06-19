"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bot,
  LayoutDashboard,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/deposit", label: "Deposit", icon: ArrowDownToLine },
  { href: "/portal/invest", label: "Invest", icon: Bot },
  { href: "/portal/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { href: "/portal/transactions", label: "Transactions", icon: Receipt },
];

export function PortalNav() {
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
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
