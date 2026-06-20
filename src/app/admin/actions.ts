"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  confirmDeposit,
  rejectDeposit,
  creditEarning,
  payWithdrawal,
  rejectWithdrawal,
  approveKyc,
  rejectKyc,
} from "@/lib/ledger";

type Result = { ok: true } | { ok: false; error: string };

const STAFF = ["admin", "finance", "support"];

async function requireStaff() {
  const user = await getCurrentUser();
  if (!user || !STAFF.includes(user.role)) return null;
  return user;
}

export async function confirmDepositAction(depositId: string): Promise<Result> {
  const admin = await requireStaff();
  if (!admin) return { ok: false, error: "Not authorized." };
  try {
    await confirmDeposit(depositId, admin.id);
    revalidatePath("/admin/deposits");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function rejectDepositAction(depositId: string): Promise<Result> {
  const admin = await requireStaff();
  if (!admin) return { ok: false, error: "Not authorized." };
  try {
    await rejectDeposit(depositId, admin.id);
    revalidatePath("/admin/deposits");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function creditEarningAction(contractId: string): Promise<Result> {
  const admin = await requireStaff();
  if (!admin) return { ok: false, error: "Not authorized." };
  try {
    await creditEarning(contractId, admin.id);
    revalidatePath("/admin/contracts");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function payWithdrawalAction(withdrawalId: string): Promise<Result> {
  const admin = await requireStaff();
  if (!admin) return { ok: false, error: "Not authorized." };
  try {
    await payWithdrawal(withdrawalId, admin.id);
    revalidatePath("/admin/withdrawals");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function rejectWithdrawalAction(withdrawalId: string): Promise<Result> {
  const admin = await requireStaff();
  if (!admin) return { ok: false, error: "Not authorized." };
  try {
    await rejectWithdrawal(withdrawalId, admin.id);
    revalidatePath("/admin/withdrawals");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function approveKycAction(kycId: string): Promise<Result> {
  const admin = await requireStaff();
  if (!admin) return { ok: false, error: "Not authorized." };
  try {
    await approveKyc(kycId, admin.id);
    revalidatePath("/admin/kyc");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function rejectKycAction(kycId: string, reason: string): Promise<Result> {
  const admin = await requireStaff();
  if (!admin) return { ok: false, error: "Not authorized." };
  try {
    await rejectKyc(kycId, admin.id, reason);
    revalidatePath("/admin/kyc");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}
