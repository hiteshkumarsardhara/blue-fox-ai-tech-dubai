"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";
import { requestDeposit, rentRobot, requestWithdrawal, submitKyc } from "@/lib/ledger";
import { saveKycFiles, deleteKycFiles, type KycUpload } from "@/lib/kyc-storage";
import { db } from "@/lib/db";

type Result = { ok: true } | { ok: false; error: string };

function dollarsToCents(v: string): number {
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
  if (!isFinite(n)) return NaN;
  return Math.round(n * 100);
}

export async function depositAction(input: {
  amount: string;
  method: string;
  reference?: string;
}): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in." };
  const cents = dollarsToCents(input.amount);
  if (!cents || cents <= 0) return { ok: false, error: "Enter a valid amount." };
  try {
    await requestDeposit(user.id, {
      amountCents: cents,
      method: input.method,
      reference: input.reference,
    });
    revalidatePath("/portal/deposit");
    revalidatePath("/portal");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function rentAction(robotId: string): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in." };
  try {
    await rentRobot(user.id, robotId);
    revalidatePath("/portal/invest");
    revalidatePath("/portal");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not rent robot." };
  }
}

export async function withdrawAction(input: {
  amount: string;
  method: string;
  destination: string;
}): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in." };
  if (user.kycStatus !== "approved")
    return { ok: false, error: "Please verify your identity (KYC) before withdrawing." };
  const cents = dollarsToCents(input.amount);
  if (!cents || cents <= 0) return { ok: false, error: "Enter a valid amount." };
  if (!input.destination?.trim())
    return { ok: false, error: "Enter where to send the funds." };
  try {
    await requestWithdrawal(user.id, {
      amountCents: cents,
      method: input.method,
      destination: input.destination.trim(),
    });
    revalidatePath("/portal/withdraw");
    revalidatePath("/portal");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not request withdrawal." };
  }
}

/** KYC submission. Receives FormData because it carries uploaded document files. */
export async function submitKycAction(formData: FormData): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in." };
  if (user.kycStatus === "approved")
    return { ok: false, error: "Your identity is already verified." };
  if (user.kycStatus === "pending")
    return { ok: false, error: "Your documents are already under review." };

  const docType = String(formData.get("docType") ?? "").trim();
  const docNumber = String(formData.get("docNumber") ?? "").trim();
  if (!docType) return { ok: false, error: "Select a document type." };

  // Required slots depend on the document type; a selfie is always required.
  const idSlots = docType === "passport" ? ["passport"] : ["front", "back"];
  const slots = [...idSlots, "selfie"];

  const uploads: KycUpload[] = [];
  for (const slot of slots) {
    const entry = formData.get(`file_${slot}`);
    if (!entry || typeof entry === "string" || entry.size === 0) {
      return { ok: false, error: `Please upload the ${slot} image.` };
    }
    uploads.push({ slot, file: entry });
  }

  let savedUrls: string;
  try {
    savedUrls = await saveKycFiles(user.id, uploads);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save your documents." };
  }

  try {
    // Capture prior submissions (with files) so we can purge their PII after success.
    const prior = await db.kycRecord.findMany({
      where: { userId: user.id, fileUrls: { not: null } },
      select: { id: true, fileUrls: true },
    });

    await submitKyc(user.id, { docType, docNumber: docNumber || undefined, fileUrls: savedUrls });

    // Success → delete superseded document files and clear their references,
    // keeping the row for the audit trail but not the sensitive bytes.
    for (const p of prior) await deleteKycFiles(user.id, p.fileUrls);
    if (prior.length) {
      await db.kycRecord.updateMany({
        where: { id: { in: prior.map((p) => p.id) } },
        data: { fileUrls: null },
      });
    }

    revalidatePath("/portal/kyc");
    revalidatePath("/portal");
    return { ok: true };
  } catch (e) {
    // The DB write failed — don't leave the just-uploaded files orphaned on disk.
    await deleteKycFiles(user.id, savedUrls);
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateProfileAction(input: {
  phone: string;
  country: string;
}): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in." };
  try {
    await db.user.update({
      where: { id: user.id },
      data: {
        phone: input.phone?.trim() || null,
        country: input.country?.trim() || null,
      },
    });
    revalidatePath("/portal/account");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not update profile." };
  }
}

export async function changePasswordAction(input: {
  current: string;
  next: string;
}): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in." };
  if (!input.next || input.next.length < 6)
    return { ok: false, error: "New password must be at least 6 characters." };

  const valid = await bcrypt.compare(input.current ?? "", user.passwordHash);
  if (!valid) return { ok: false, error: "Current password is incorrect." };

  try {
    const passwordHash = await bcrypt.hash(input.next, 10);
    await db.user.update({ where: { id: user.id }, data: { passwordHash } });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not change password." };
  }
}
