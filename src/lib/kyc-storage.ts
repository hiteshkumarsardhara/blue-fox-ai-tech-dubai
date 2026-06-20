import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Local-disk storage for KYC documents. These are sensitive PII, so files live
 * OUTSIDE the public/ folder (in /uploads/kyc/<userId>/) and are only served
 * through the auth-gated route handler at /api/kyc/file/[id].
 *
 * In production this module is the single seam to swap for S3/blob storage.
 */

const UPLOAD_ROOT = path.join(process.cwd(), "uploads", "kyc");
const MAX_BYTES = 8 * 1024 * 1024; // 8MB per file

/** MIME type → extension for the formats we accept. */
const ALLOWED = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/heic", "heic"],
  ["application/pdf", "pdf"],
]);

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  pdf: "application/pdf",
};

const SAFE_NAME = /^[a-zA-Z0-9._-]+$/;

export type KycUpload = { slot: string; file: File };

/**
 * Validate + persist a batch of KYC files for one user.
 * Returns a comma-joined "slot:filename" string for KycRecord.fileUrls.
 */
export async function saveKycFiles(userId: string, uploads: KycUpload[]): Promise<string> {
  const dir = path.join(UPLOAD_ROOT, userId);
  await mkdir(dir, { recursive: true });

  const entries: string[] = [];
  for (const { slot, file } of uploads) {
    if (!file || file.size === 0) throw new Error(`Missing ${slot} document.`);
    if (file.size > MAX_BYTES) throw new Error(`The ${slot} file is too large (max 8MB).`);
    const ext = ALLOWED.get(file.type);
    if (!ext) throw new Error(`Unsupported file type for ${slot}. Use JPG, PNG, WEBP, HEIC or PDF.`);

    const filename = `${randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), bytes);
    entries.push(`${slot}:${filename}`);
  }
  return entries.join(",");
}

/** Delete the files referenced by a fileUrls string. Best-effort (ignores missing). */
export async function deleteKycFiles(userId: string, fileUrls: string | null): Promise<void> {
  if (!SAFE_NAME.test(userId)) return;
  for (const { filename } of parseFileUrls(fileUrls)) {
    if (!SAFE_NAME.test(filename)) continue;
    try {
      await unlink(path.join(UPLOAD_ROOT, userId, filename));
    } catch {
      // already gone — ignore
    }
  }
}

/** Read a stored KYC file's bytes, guarding against path traversal. */
export async function readKycFile(userId: string, filename: string): Promise<Buffer> {
  if (!SAFE_NAME.test(filename) || !SAFE_NAME.test(userId)) {
    throw new Error("Invalid file reference.");
  }
  return readFile(path.join(UPLOAD_ROOT, userId, filename));
}

export function contentTypeFor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

/** Parse a KycRecord.fileUrls string into labelled file references. */
export function parseFileUrls(fileUrls: string | null): { slot: string; filename: string }[] {
  return (fileUrls ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const idx = entry.indexOf(":");
      if (idx === -1) return { slot: "document", filename: entry };
      return { slot: entry.slice(0, idx), filename: entry.slice(idx + 1) };
    });
}
