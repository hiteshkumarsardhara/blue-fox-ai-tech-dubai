"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

export function ReferralLink({ code }: { code: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  // Set after mount so SSR and first client render match (no hydration mismatch).
  useEffect(() => setOrigin(window.location.origin), []);

  const link = `${origin}/register?ref=${code}`;

  async function copy(text: string, which: "link" | "code") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard blocked — ignore
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1.5 text-xs font-medium text-muted">Your referral link</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
          <button
            type="button"
            onClick={() => copy(link, "link")}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {copied === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === "link" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted">Your referral code</p>
        <button
          type="button"
          onClick={() => copy(code, "code")}
          className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface-2/40 px-3.5 py-2 font-mono text-sm text-foreground transition-colors hover:bg-surface-2"
        >
          {code}
          {copied === "code" ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4 text-muted-2" />
          )}
        </button>
      </div>
    </div>
  );
}
