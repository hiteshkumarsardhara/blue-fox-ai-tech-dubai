import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { readKycFile, contentTypeFor, parseFileUrls } from "@/lib/kyc-storage";

// node:fs needs the Node runtime; keep this gated endpoint dynamic (never cached).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STAFF = ["admin", "finance", "support"];
const SAFE_NAME = /^[a-zA-Z0-9._-]+$/;

/** Serve a KYC document to its owner or to staff only. `id` is the stored filename. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  // Reject anything that isn't a plain filename before it reaches the DB query.
  if (!SAFE_NAME.test(id)) return new Response("Not found", { status: 404 });

  const isStaff = STAFF.includes(user.role);
  // Non-staff are scoped to their OWN records, so a foreign file can never match.
  // This both authorizes and removes the 403-vs-404 enumeration oracle (all
  // unauthorized/missing lookups return a uniform 404).
  const rec = await db.kycRecord.findFirst({
    where: isStaff
      ? { fileUrls: { contains: id } }
      : { userId: user.id, fileUrls: { contains: id } },
  });
  if (!rec) return new Response("Not found", { status: 404 });

  // Guard against substring false-positives: the filename must be an exact entry.
  const belongs = parseFileUrls(rec.fileUrls).some((f) => f.filename === id);
  if (!belongs) return new Response("Not found", { status: 404 });

  try {
    const buf = await readKycFile(rec.userId, id);
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": contentTypeFor(id),
        "Content-Disposition": `inline; filename="${id}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
