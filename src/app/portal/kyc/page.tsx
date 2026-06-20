import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Clock, ShieldX, FileText } from "lucide-react";
import { Container } from "@/components/ui/container";
import { KycForm } from "@/components/portal/kyc-form";
import { StatusBadge } from "@/components/portal/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseFileUrls } from "@/lib/kyc-storage";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Verify identity" };

const DOC_LABELS: Record<string, string> = {
  passport: "Passport",
  emirates_id: "Emirates ID",
  national_id: "National ID",
  drivers_license: "Driver's licence",
};

const SLOT_LABELS: Record<string, string> = {
  passport: "Passport",
  front: "Front",
  back: "Back",
  selfie: "Selfie",
  document: "Document",
};

const HUB = {
  none: {
    icon: ShieldAlert,
    label: "Not verified",
    ring: "border-border-strong bg-surface-2 text-muted",
    msg: "Verify your identity to unlock withdrawals.",
  },
  pending: {
    icon: Clock,
    label: "Under review",
    ring: "border-warning/30 bg-warning/10 text-warning",
    msg: "We're reviewing your documents, usually within 24–48 hours.",
  },
  approved: {
    icon: ShieldCheck,
    label: "Verified",
    ring: "border-success/30 bg-success-soft text-success",
    msg: "Your identity is verified. Withdrawals are enabled.",
  },
  rejected: {
    icon: ShieldX,
    label: "Action needed",
    ring: "border-danger/30 bg-danger-soft text-danger",
    msg: "Your submission was not approved. Please review the reason and re-submit.",
  },
} as const;

export default async function KycPage() {
  const user = await getCurrentUser();
  const status = (user!.kycStatus ?? "none") as keyof typeof HUB;
  const records = await db.kycRecord.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const hub = HUB[status] ?? HUB.none;
  const HubIcon = hub.icon;
  const showForm = status === "none" || status === "rejected";
  const rejectionReason =
    status === "rejected" ? records.find((r) => r.status === "rejected")?.note : null;

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Identity verification</h1>
      <p className="mt-1 text-muted">Verify once to enable withdrawals from your wallet.</p>

      {/* Status hub */}
      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface p-5">
        <span className={cn("grid h-12 w-12 place-items-center rounded-xl border", hub.ring)}>
          <HubIcon className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{hub.label}</p>
          <p className="text-sm text-muted">{hub.msg}</p>
        </div>
        {status === "approved" && (
          <Link href="/portal/withdraw" className={buttonVariants({ size: "sm" })}>
            Withdraw funds
          </Link>
        )}
      </div>

      {rejectionReason && (
        <div className="mt-4 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm">
          <span className="font-medium text-danger">Reason: </span>
          <span className="text-foreground">{rejectionReason}</span>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {showForm ? (
          <KycForm resubmit={status === "rejected"} />
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold text-foreground">
              {status === "pending" ? "Submitted — under review" : "You're verified"}
            </h2>
            <p className="mt-1 text-sm text-muted">{hub.msg}</p>
          </div>
        )}

        {/* Submission history */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-foreground">Your submissions</h2>
          {records.length === 0 ? (
            <p className="mt-3 text-sm text-muted-2">No submissions yet.</p>
          ) : (
            <ul className="mt-3 space-y-4">
              {records.map((r) => {
                const files = parseFileUrls(r.fileUrls);
                return (
                  <li key={r.id} className="rounded-xl border border-border bg-background/40 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {DOC_LABELS[r.docType] ?? r.docType}
                        </p>
                        <p className="text-xs text-muted-2">{r.createdAt.toLocaleString()}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                    {files.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {files.map((f) => (
                          <a
                            key={f.filename}
                            href={`/api/kyc/file/${f.filename}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:text-foreground"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            {SLOT_LABELS[f.slot] ?? f.slot}
                          </a>
                        ))}
                      </div>
                    )}
                    {r.status === "rejected" && r.note && (
                      <p className="mt-2 text-xs text-danger">{r.note}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}
