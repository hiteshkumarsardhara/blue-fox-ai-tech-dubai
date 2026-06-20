import { db } from "@/lib/db";
import type { PrismaClient } from "@/generated/prisma/client";

/**
 * Money engine. Every balance change goes through an immutable LedgerEntry and
 * updates the Wallet inside a single transaction. Amounts are integer cents.
 *
 * Wallet semantics:
 *  - availableCents: spendable (can invest / withdraw)
 *  - investedCents: locked in active contracts
 *  - totalEarningsCents / totalDepositedCents / totalWithdrawnCents: lifetime totals
 */

type Tx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

function addMonths(date: Date, n: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

/** Append a ledger entry and move the user's AVAILABLE balance by `amountCents` (signed). */
async function moveAvailable(
  tx: Tx,
  userId: string,
  type: string,
  amountCents: number,
  ref?: { refType?: string; refId?: string; note?: string },
) {
  const wallet = await tx.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new Error("Wallet not found");
  const balanceAfter = wallet.availableCents + amountCents;
  if (balanceAfter < 0) throw new Error("Insufficient balance");
  await tx.wallet.update({
    where: { userId },
    data: { availableCents: balanceAfter },
  });
  await tx.ledgerEntry.create({
    data: {
      userId,
      type,
      amountCents,
      balanceAfterCents: balanceAfter,
      refType: ref?.refType,
      refId: ref?.refId,
      note: ref?.note,
    },
  });
  return balanceAfter;
}

async function audit(tx: Tx, actorId: string | null, action: string, entityType: string, entityId: string) {
  await tx.auditLog.create({ data: { actorId, action, entityType, entityId } });
}

/**
 * Credit the renter's referrer a configurable % of the rental principal.
 * Best-effort: any missing referrer/wallet/setting is skipped so it can never
 * fail the rental transaction it runs inside.
 */
async function payReferralCommission(
  tx: Tx,
  renterId: string,
  principalCents: number,
  contractId: string,
) {
  const renter = await tx.user.findUnique({
    where: { id: renterId },
    select: { referredById: true },
  });
  if (!renter?.referredById) return;

  const refWallet = await tx.wallet.findUnique({ where: { userId: renter.referredById } });
  if (!refWallet) return;

  const setting = await tx.setting.findUnique({ where: { key: "referral_commission_pct" } });
  const pct = setting ? parseFloat(setting.value) : 0;
  if (!pct || pct <= 0) return;

  const commission = Math.round((principalCents * pct) / 100);
  if (commission <= 0) return;

  await moveAvailable(tx, renter.referredById, "referral_commission", commission, {
    refType: "Contract",
    refId: contractId,
    note: `Referral commission (${pct}%)`,
  });
  await audit(tx, renter.referredById, "referral_commission", "Contract", contractId);
}

/* ───────────────────────────── Deposits ───────────────────────────── */

export async function requestDeposit(
  userId: string,
  input: { amountCents: number; method: string; network?: string; reference?: string; note?: string },
) {
  if (input.amountCents <= 0) throw new Error("Enter a valid amount.");
  return db.deposit.create({
    data: {
      userId,
      amountCents: input.amountCents,
      method: input.method,
      network: input.network ?? null,
      reference: input.reference ?? null,
      note: input.note ?? null,
      status: "pending",
    },
  });
}

export async function confirmDeposit(depositId: string, adminId: string) {
  return db.$transaction(async (tx) => {
    const dep = await tx.deposit.findUnique({ where: { id: depositId } });
    if (!dep) throw new Error("Deposit not found");
    if (dep.status !== "pending") throw new Error("Deposit already processed");

    await tx.deposit.update({
      where: { id: depositId },
      data: { status: "confirmed", confirmedById: adminId, confirmedAt: new Date() },
    });
    await tx.wallet.update({
      where: { userId: dep.userId },
      data: { totalDepositedCents: { increment: dep.amountCents } },
    });
    await moveAvailable(tx, dep.userId, "deposit", dep.amountCents, {
      refType: "Deposit",
      refId: dep.id,
    });
    await audit(tx, adminId, "deposit_confirmed", "Deposit", dep.id);
  });
}

export async function rejectDeposit(depositId: string, adminId: string, note?: string) {
  return db.$transaction(async (tx) => {
    const dep = await tx.deposit.findUnique({ where: { id: depositId } });
    if (!dep) throw new Error("Deposit not found");
    if (dep.status !== "pending") throw new Error("Deposit already processed");
    await tx.deposit.update({
      where: { id: depositId },
      data: { status: "rejected", confirmedById: adminId, confirmedAt: new Date(), note: note ?? dep.note },
    });
    await audit(tx, adminId, "deposit_rejected", "Deposit", dep.id);
  });
}

/* ───────────────────────── Invest (rent a robot) ───────────────────── */

export async function rentRobot(userId: string, robotId: string) {
  return db.$transaction(async (tx) => {
    const robot = await tx.robot.findUnique({ where: { id: robotId } });
    if (!robot || robot.status !== "active") throw new Error("Robot not available");

    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error("Wallet not found");
    if (wallet.availableCents < robot.depositCents)
      throw new Error("Insufficient balance — please deposit first.");

    // Upgrade-only: a new robot can't cost less than the client's highest
    // currently-active robot. Equal or higher packages are allowed; downgrades
    // are not.
    const activeContracts = await tx.contract.findMany({
      where: { userId, status: "active" },
      select: { principalCents: true },
    });
    const currentMax = activeContracts.reduce((m, c) => Math.max(m, c.principalCents), 0);
    if (robot.depositCents < currentMax)
      throw new Error("You can only rent an equal or higher package — downgrades aren't allowed.");

    const start = new Date();
    const contract = await tx.contract.create({
      data: {
        userId,
        robotId: robot.id,
        principalCents: robot.depositCents,
        termMonths: robot.contractMonths,
        monthlyRoi: robot.monthlyRoi,
        status: "active",
        startDate: start,
        endDate: addMonths(start, robot.contractMonths),
        nextPayoutAt: addMonths(start, 1),
      },
    });

    await tx.wallet.update({
      where: { userId },
      data: { investedCents: { increment: robot.depositCents } },
    });
    await moveAvailable(tx, userId, "investment_hold", -robot.depositCents, {
      refType: "Contract",
      refId: contract.id,
      note: `Rented ${robot.name}`,
    });
    await audit(tx, userId, "robot_rented", "Contract", contract.id);

    // Reward the referrer (if any) — never blocks the rental.
    await payReferralCommission(tx, userId, robot.depositCents, contract.id);

    return contract;
  });
}

/* ───────────────────────── Monthly earnings ───────────────────────── */

export async function creditEarning(contractId: string, adminId: string) {
  return db.$transaction(async (tx) => {
    const contract = await tx.contract.findUnique({ where: { id: contractId } });
    if (!contract) throw new Error("Contract not found");
    if (contract.status !== "active") throw new Error("Contract is not active");

    const credited = await tx.earning.count({ where: { contractId } });
    const periodIndex = credited + 1;
    if (periodIndex > contract.termMonths) throw new Error("All payouts already credited");

    const amount = Math.round((contract.principalCents * contract.monthlyRoi) / 100);

    await tx.earning.create({
      data: {
        contractId,
        userId: contract.userId,
        periodIndex,
        pct: contract.monthlyRoi,
        amountCents: amount,
        status: "credited",
      },
    });
    await tx.wallet.update({
      where: { userId: contract.userId },
      data: { totalEarningsCents: { increment: amount } },
    });
    await moveAvailable(tx, contract.userId, "earning", amount, {
      refType: "Contract",
      refId: contractId,
      note: `Month ${periodIndex} return`,
    });

    const isLast = periodIndex >= contract.termMonths;
    await tx.contract.update({
      where: { id: contractId },
      data: {
        totalPaidOutCents: { increment: amount },
        nextPayoutAt: isLast ? null : addMonths(contract.nextPayoutAt ?? new Date(), 1),
        status: isLast ? "completed" : "active",
      },
    });
    await audit(tx, adminId, "earning_credited", "Contract", contractId);
  });
}

/* ───────────────────────────── Withdrawals ────────────────────────── */

export async function requestWithdrawal(
  userId: string,
  input: { amountCents: number; method: string; destination: string },
) {
  if (input.amountCents <= 0) throw new Error("Enter a valid amount.");
  return db.$transaction(async (tx) => {
    // Hold the funds immediately so they can't be double-spent.
    await moveAvailable(tx, userId, "withdrawal", -input.amountCents, {
      refType: "Withdrawal",
      refId: "pending",
      note: `Withdrawal via ${input.method}`,
    });
    const wd = await tx.withdrawal.create({
      data: {
        userId,
        amountCents: input.amountCents,
        method: input.method,
        destination: input.destination,
        status: "pending",
      },
    });
    await audit(tx, userId, "withdrawal_requested", "Withdrawal", wd.id);
    return wd;
  });
}

export async function payWithdrawal(withdrawalId: string, adminId: string) {
  return db.$transaction(async (tx) => {
    const wd = await tx.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!wd) throw new Error("Withdrawal not found");
    if (wd.status !== "pending") throw new Error("Withdrawal already processed");
    await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: "paid", processedById: adminId, processedAt: new Date() },
    });
    await tx.wallet.update({
      where: { userId: wd.userId },
      data: { totalWithdrawnCents: { increment: wd.amountCents } },
    });
    await audit(tx, adminId, "withdrawal_paid", "Withdrawal", wd.id);
  });
}

export async function rejectWithdrawal(withdrawalId: string, adminId: string, note?: string) {
  return db.$transaction(async (tx) => {
    const wd = await tx.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!wd) throw new Error("Withdrawal not found");
    if (wd.status !== "pending") throw new Error("Withdrawal already processed");
    await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: "rejected", processedById: adminId, processedAt: new Date(), note: note ?? wd.note },
    });
    // Refund the held funds.
    await moveAvailable(tx, wd.userId, "adjustment", wd.amountCents, {
      refType: "Withdrawal",
      refId: wd.id,
      note: "Withdrawal rejected — refund",
    });
    await audit(tx, adminId, "withdrawal_rejected", "Withdrawal", wd.id);
  });
}

/* ───────────────────────────── KYC ───────────────────────────── */

export async function submitKyc(
  userId: string,
  input: { docType: string; docNumber?: string; fileUrls: string },
) {
  if (!input.docType?.trim()) throw new Error("Select a document type.");
  if (!input.fileUrls?.trim()) throw new Error("Upload your documents.");
  return db.$transaction(async (tx) => {
    // Re-check status inside the transaction so two concurrent submits can't
    // both create a pending record (the action-level guard is a stale read).
    const current = await tx.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true },
    });
    if (!current) throw new Error("User not found");
    if (current.kycStatus === "pending") throw new Error("Your documents are already under review.");
    if (current.kycStatus === "approved") throw new Error("Your identity is already verified.");

    const rec = await tx.kycRecord.create({
      data: {
        userId,
        docType: input.docType,
        docNumber: input.docNumber ?? null,
        fileUrls: input.fileUrls,
        status: "pending",
      },
    });
    await tx.user.update({ where: { id: userId }, data: { kycStatus: "pending" } });
    await audit(tx, userId, "kyc_submitted", "KycRecord", rec.id);
    return rec;
  });
}

export async function approveKyc(kycId: string, adminId: string) {
  return db.$transaction(async (tx) => {
    const rec = await tx.kycRecord.findUnique({ where: { id: kycId } });
    if (!rec) throw new Error("KYC record not found");
    if (rec.status !== "pending") throw new Error("KYC already reviewed");
    await tx.kycRecord.update({
      where: { id: kycId },
      data: { status: "approved", reviewedById: adminId, reviewedAt: new Date(), note: null },
    });
    await tx.user.update({ where: { id: rec.userId }, data: { kycStatus: "approved" } });
    await audit(tx, adminId, "kyc_approved", "KycRecord", rec.id);
  });
}

export async function rejectKyc(kycId: string, adminId: string, reason: string) {
  if (!reason?.trim()) throw new Error("A rejection reason is required.");
  return db.$transaction(async (tx) => {
    const rec = await tx.kycRecord.findUnique({ where: { id: kycId } });
    if (!rec) throw new Error("KYC record not found");
    if (rec.status !== "pending") throw new Error("KYC already reviewed");
    await tx.kycRecord.update({
      where: { id: kycId },
      data: { status: "rejected", reviewedById: adminId, reviewedAt: new Date(), note: reason.trim() },
    });
    await tx.user.update({ where: { id: rec.userId }, data: { kycStatus: "rejected" } });
    await audit(tx, adminId, "kyc_rejected", "KycRecord", rec.id);
  });
}
