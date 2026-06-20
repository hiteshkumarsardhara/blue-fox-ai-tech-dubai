"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  confirmDeposit,
  rejectDeposit,
  creditEarning,
  payWithdrawal,
  rejectWithdrawal,
  approveKyc,
  rejectKyc,
  rentRobot,
} from "@/lib/ledger";
import {
  notifyDepositConfirmed,
  notifyEarningCredited,
  notifyWithdrawalPaid,
  notifyKycDecision,
} from "@/lib/mail";

type Result = { ok: true } | { ok: false; error: string };

const SETTING_KEYS = [
  "deposit_usdt_trc20",
  "deposit_usdt_erc20",
  "deposit_bank_details",
  "referral_commission_pct",
];

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
    try {
      const dep = await db.deposit.findUnique({
        where: { id: depositId },
        include: { user: { select: { email: true, name: true } } },
      });
      if (dep) await notifyDepositConfirmed(dep.user.email, dep.user.name, dep.amountCents);
    } catch {}
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
    try {
      const contract = await db.contract.findUnique({
        where: { id: contractId },
        include: {
          robot: { select: { name: true } },
          user: { select: { email: true, name: true } },
        },
      });
      const last = await db.earning.findFirst({
        where: { contractId },
        orderBy: { creditedAt: "desc" },
      });
      if (contract && last)
        await notifyEarningCredited(contract.user.email, contract.user.name, last.amountCents, contract.robot.name);
    } catch {}
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
    try {
      const wd = await db.withdrawal.findUnique({
        where: { id: withdrawalId },
        include: { user: { select: { email: true, name: true } } },
      });
      if (wd) await notifyWithdrawalPaid(wd.user.email, wd.user.name, wd.amountCents);
    } catch {}
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
    try {
      const rec = await db.kycRecord.findUnique({
        where: { id: kycId },
        include: { user: { select: { email: true, name: true } } },
      });
      if (rec) await notifyKycDecision(rec.user.email, rec.user.name, true);
    } catch {}
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
    try {
      const rec = await db.kycRecord.findUnique({
        where: { id: kycId },
        include: { user: { select: { email: true, name: true } } },
      });
      if (rec) await notifyKycDecision(rec.user.email, rec.user.name, false, reason);
    } catch {}
    revalidatePath("/admin/kyc");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function adminRentAction(userId: string, robotId: string): Promise<Result> {
  const admin = await requireStaff();
  if (!admin) return { ok: false, error: "Not authorized." };
  if (!userId || !robotId) return { ok: false, error: "Select a client and a robot." };
  try {
    // Admin override: bypass the strict-upgrade rule (balance still required).
    await rentRobot(userId, robotId, { actorId: admin.id, allowAnyTier: true });
    revalidatePath("/admin/contracts");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not rent the robot." };
  }
}

export async function saveSettingsAction(values: Record<string, string>): Promise<Result> {
  const admin = await requireStaff();
  if (!admin) return { ok: false, error: "Not authorized." };

  const pct = values.referral_commission_pct;
  if (pct !== undefined && pct !== "") {
    const n = Number(pct);
    if (!Number.isFinite(n) || n < 0 || n > 100)
      return { ok: false, error: "Referral commission must be a number between 0 and 100." };
  }

  try {
    for (const key of SETTING_KEYS) {
      if (key in values) {
        const value = String(values[key] ?? "").trim();
        await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
      }
    }
    revalidatePath("/admin/settings");
    revalidatePath("/portal/deposit");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save settings." };
  }
}
