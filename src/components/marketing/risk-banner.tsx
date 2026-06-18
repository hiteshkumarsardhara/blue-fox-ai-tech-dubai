import { TriangleAlert } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Persistent, site-wide risk warning bar.
 * Forex/CFD marketing requires a conspicuous, always-visible risk notice.
 */
export function RiskBanner() {
  return (
    <div className="border-b border-border bg-danger-soft/60">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-1.5 sm:px-8">
        <TriangleAlert className="h-3.5 w-3.5 shrink-0 text-danger" />
        <p className="truncate text-[11px] leading-tight text-muted">
          <span className="font-semibold text-foreground/90">Risk warning:</span>{" "}
          {site.riskWarning}
        </p>
      </div>
    </div>
  );
}
