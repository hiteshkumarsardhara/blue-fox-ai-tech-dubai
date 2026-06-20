import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/portal/status-badge";
import { KycActions } from "@/components/admin/row-actions";
import { db } from "@/lib/db";
import { parseFileUrls } from "@/lib/kyc-storage";

export const metadata: Metadata = { title: "Admin · KYC" };

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

const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "heic"];

type Row = {
  id: string;
  docType: string;
  docNumber: string | null;
  fileUrls: string | null;
  status: string;
  note: string | null;
  createdAt: Date;
  user: { name: string; email: string };
};

export default async function AdminKyc() {
  const records = (await db.kycRecord.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
  })) as Row[];

  const pending = records.filter((r) => r.status === "pending");
  const rest = records.filter((r) => r.status !== "pending");

  return (
    <Container className="max-w-7xl py-10">
      <h1 className="text-2xl font-semibold tracking-tight">KYC verification</h1>
      <p className="mt-1 text-muted">
        Review submitted documents, then approve or reject with a reason. {pending.length} awaiting
        review.
      </p>

      <Section title="Awaiting review" rows={pending} actionable />
      {rest.length > 0 && <Section title="Reviewed" rows={rest} />}
    </Container>
  );
}

function DocLinks({ fileUrls }: { fileUrls: string | null }) {
  const files = parseFileUrls(fileUrls);
  if (files.length === 0) return <p className="text-xs text-muted-2">No documents.</p>;
  return (
    <div className="flex flex-wrap gap-3">
      {files.map((f) => {
        const ext = f.filename.split(".").pop()?.toLowerCase() ?? "";
        const isImage = IMAGE_EXT.includes(ext);
        const href = `/api/kyc/file/${f.filename}`;
        return (
          <a
            key={f.filename}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group block w-24 overflow-hidden rounded-lg border border-border bg-background/40 text-center"
          >
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={href} alt={f.slot} className="h-20 w-full object-cover" />
            ) : (
              <span className="flex h-20 w-full items-center justify-center text-muted-2">
                <FileText className="h-7 w-7" />
              </span>
            )}
            <span className="block py-1 text-[11px] font-medium text-muted group-hover:text-foreground">
              {SLOT_LABELS[f.slot] ?? f.slot}
            </span>
          </a>
        );
      })}
    </div>
  );
}

function Section({ title, rows, actionable }: { title: string; rows: Row[]; actionable?: boolean }) {
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-2">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-border-strong bg-surface/50 px-5 py-8 text-center text-sm text-muted-2">
          Nothing here.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{r.user.name}</p>
                  <p className="text-xs text-muted-2">{r.user.email}</p>
                  <p className="mt-1 text-sm text-muted">
                    {DOC_LABELS[r.docType] ?? r.docType}
                    {r.docNumber ? ` · ${r.docNumber}` : ""} · {r.createdAt.toLocaleDateString()}
                  </p>
                </div>
                {actionable ? <KycActions id={r.id} /> : <StatusBadge status={r.status} />}
              </div>

              <div className="mt-4">
                <DocLinks fileUrls={r.fileUrls} />
              </div>

              {r.status === "rejected" && r.note && (
                <p className="mt-3 rounded-lg border border-danger/30 bg-danger-soft px-3 py-1.5 text-xs text-danger">
                  Rejected: {r.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
