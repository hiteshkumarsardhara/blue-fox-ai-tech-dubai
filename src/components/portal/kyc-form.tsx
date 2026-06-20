"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  UploadCloud,
  FileText,
  X,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { submitKycAction } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/i18n-provider";

const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30";

const DOC_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "emirates_id", label: "Emirates ID" },
  { value: "national_id", label: "National ID" },
  { value: "drivers_license", label: "Driver's licence" },
];

const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,.heic,application/pdf";
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];
const MAX_MB = 8;

type Slot = { key: string; labelKey: string; hintKey: string };

function slotsFor(docType: string): Slot[] {
  const idSlots: Slot[] =
    docType === "passport"
      ? [{ key: "passport", labelKey: "portal.kyc.slotPassportLabel", hintKey: "portal.kyc.slotPassportHint" }]
      : [
          { key: "front", labelKey: "portal.kyc.slotFrontLabel", hintKey: "portal.kyc.slotFrontHint" },
          { key: "back", labelKey: "portal.kyc.slotBackLabel", hintKey: "portal.kyc.slotBackHint" },
        ];
  return [
    ...idSlots,
    { key: "selfie", labelKey: "portal.kyc.slotSelfieLabel", hintKey: "portal.kyc.slotSelfieHint" },
  ];
}

/** Single upload slot: idle dropzone → image/file preview with remove. */
function SlotUpload({
  slot,
  file,
  onPick,
  onClear,
  error,
}: {
  slot: Slot;
  file: File | null;
  onPick: (f: File | null) => void;
  onClear: () => void;
  error?: string;
}) {
  const { t } = useTranslations();
  const ref = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const slotLabel = t(slot.labelKey);

  // Create exactly one object URL per image file and revoke it on change/unmount.
  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted">
        {slotLabel} <span className="text-danger">*</span>
      </p>

      {!file ? (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-4 py-6 text-center transition-colors",
            error
              ? "border-danger/50 bg-danger-soft/30"
              : "border-border-strong bg-surface-2/40 hover:border-primary/50 hover:bg-primary-soft/30",
          )}
        >
          <UploadCloud className="h-6 w-6 text-muted-2" />
          <span className="text-sm font-medium text-foreground">{t("portal.kyc.clickToUpload")}</span>
          <span className="text-xs text-muted-2">{t(slot.hintKey)}</span>
          <span className="text-[11px] text-muted-2">{t("portal.kyc.fileFormats")} {MAX_MB}MB</span>
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/40 p-2.5">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={slotLabel}
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-background/60 text-muted-2">
              <FileText className="h-6 w-6" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            type="button"
            onClick={onClear}
            aria-label={`Remove ${slotLabel}`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-2 transition-colors hover:bg-danger-soft hover:text-danger"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}

      <input
        ref={ref}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

export function KycForm({ resubmit = false }: { resubmit?: boolean }) {
  const { t } = useTranslations();
  const router = useRouter();
  const [docType, setDocType] = useState("passport");
  const [docNumber, setDocNumber] = useState("");
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [slotErrors, setSlotErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const slots = slotsFor(docType);

  function changeDocType(next: string) {
    setDocType(next);
    setFiles({});
    setSlotErrors({});
    setError("");
  }

  function pick(slotKey: string, f: File | null) {
    if (!f) return;
    const next = { ...slotErrors };
    if (f.size > MAX_MB * 1024 * 1024) {
      next[slotKey] = `${t("portal.kyc.fileTooLarge")} ${MAX_MB}MB).`;
      setSlotErrors(next);
      return;
    }
    // Some browsers report an empty type for HEIC — let those through (server validates).
    if (f.type && !ACCEPTED_TYPES.includes(f.type)) {
      next[slotKey] = t("portal.kyc.unsupportedType");
      setSlotErrors(next);
      return;
    }
    delete next[slotKey];
    setSlotErrors(next);
    setFiles((prev) => ({ ...prev, [slotKey]: f }));
  }

  function clear(slotKey: string) {
    setFiles((prev) => ({ ...prev, [slotKey]: null }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    for (const s of slots) {
      if (!files[s.key]) {
        setError(`${t("portal.kyc.pleaseUpload")} ${t(s.labelKey)}.`);
        return;
      }
    }
    if (!consent) {
      setError(t("portal.kyc.confirmDocsYours"));
      return;
    }

    setLoading(true);
    setError("");
    const fd = new FormData();
    fd.set("docType", docType);
    fd.set("docNumber", docNumber);
    for (const s of slots) fd.set(`file_${s.key}`, files[s.key] as File);

    const res = await submitKycAction(fd);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success-soft p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
        <h2 className="mt-3 text-lg font-semibold text-foreground">{t("portal.kyc.documentsSubmitted")}</h2>
        <p className="mt-1 text-sm text-muted">
          {t("portal.kyc.reviewWithinHours")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold text-foreground">
        {resubmit ? t("portal.kyc.resubmitDocuments") : t("portal.kyc.verifyYourIdentity")}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {t("portal.kyc.uploadIdAndSelfie")}
      </p>

      {/* Document type */}
      <div className="mt-5">
        <span className="mb-1.5 block text-xs font-medium text-muted">{t("portal.kyc.documentType")}</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DOC_TYPES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => changeDocType(d.value)}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                docType === d.value
                  ? "border-primary/50 bg-primary-soft text-primary"
                  : "border-border bg-background/40 text-muted hover:text-foreground",
              )}
            >
              {t(`portal.kyc.doc_${d.value}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Document number */}
      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-medium text-muted">
          {t("portal.kyc.documentNumber")} <span className="text-muted-2">{t("portal.kyc.optional")}</span>
        </span>
        <input
          value={docNumber}
          onChange={(e) => setDocNumber(e.target.value)}
          placeholder={t("portal.kyc.documentNumberPlaceholder")}
          className={inputClass}
        />
      </label>

      {/* Upload slots */}
      <div className="mt-5 space-y-4">
        {slots.map((s) => (
          <SlotUpload
            key={s.key}
            slot={s}
            file={files[s.key] ?? null}
            onPick={(f) => pick(s.key, f)}
            onClear={() => clear(s.key)}
            error={slotErrors[s.key]}
          />
        ))}
      </div>

      {/* Privacy reassurance */}
      <div className="mt-5 flex items-start gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-muted">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        {t("portal.kyc.privacyNote")}
      </div>

      {/* Consent */}
      <label className="mt-4 flex items-start gap-2.5 text-sm text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border-strong bg-background accent-primary"
        />
        <span>{t("portal.kyc.consentLabel")}</span>
      </label>

      {error && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="mt-5 w-full">
        {loading ? (
          t("portal.kyc.submitting")
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" /> {t("portal.kyc.submitForVerification")}
          </>
        )}
      </Button>
    </form>
  );
}
