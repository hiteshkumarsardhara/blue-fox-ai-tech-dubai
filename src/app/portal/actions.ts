"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { requestDeposit, rentRobot, requestWithdrawal } from "@/lib/ledger";

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
