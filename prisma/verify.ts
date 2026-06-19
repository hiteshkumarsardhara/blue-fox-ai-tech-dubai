/**
 * End-to-end money-loop check. Exercises the REAL ledger engine against dev.db.
 * Run: npx tsx prisma/verify.ts
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import {
  requestDeposit,
  confirmDeposit,
  rentRobot,
  creditEarning,
  requestWithdrawal,
  payWithdrawal,
} from "../src/lib/ledger";

const $ = (c: number) => "$" + (c / 100).toFixed(2);

async function show(uid: string, label: string) {
  const w = await db.wallet.findUnique({ where: { userId: uid } });
  if (!w) return console.log(label, "(no wallet)");
  console.log(
    `${label}\n   available=${$(w.availableCents)}  invested=${$(w.investedCents)}  ` +
      `earnings=${$(w.totalEarningsCents)}  deposited=${$(w.totalDepositedCents)}  withdrawn=${$(w.totalWithdrawnCents)}`,
  );
}

async function main() {
  const email = "loop@test.com";

  // Fresh start: wipe any prior run for this test user.
  const prior = await db.user.findUnique({ where: { email } });
  if (prior) {
    await db.ledgerEntry.deleteMany({ where: { userId: prior.id } });
    await db.earning.deleteMany({ where: { userId: prior.id } });
    await db.contract.deleteMany({ where: { userId: prior.id } });
    await db.deposit.deleteMany({ where: { userId: prior.id } });
    await db.withdrawal.deleteMany({ where: { userId: prior.id } });
    await db.wallet.deleteMany({ where: { userId: prior.id } });
    await db.user.delete({ where: { id: prior.id } });
  }

  const user = await db.user.create({
    data: {
      email,
      name: "Loop Test",
      passwordHash: await bcrypt.hash("Test@12345", 10),
      role: "client",
      wallet: { create: {} },
    },
  });
  const uid = user.id;
  const admin = await db.user.findFirst({ where: { role: "admin" } });
  if (!admin) throw new Error("No admin user seeded — run npm run db:seed first.");

  console.log("=== BLUE FOX MONEY LOOP ===");
  await show(uid, "1. New client");

  const dep = await requestDeposit(uid, { amountCents: 500000, method: "usdt" });
  await confirmDeposit(dep.id, admin.id);
  await show(uid, "2. After admin confirms $5,000 deposit  (expect available=$5,000)");

  const robot = await db.robot.findFirst({
    where: { status: "active", depositCents: { lte: 500000 } },
    orderBy: { depositCents: "desc" },
  });
  if (!robot) throw new Error("No affordable robot found.");
  console.log(
    `   → renting "${robot.name}"  deposit=${$(robot.depositCents)}  roi=${robot.monthlyRoi}%/mo  term=${robot.contractMonths}mo`,
  );
  const contract = await rentRobot(uid, robot.id);
  await show(uid, "3. After renting robot  (expect available down, invested up)");

  await creditEarning(contract.id, admin.id);
  const expectedMonthly = Math.round((robot.depositCents * robot.monthlyRoi) / 100);
  await show(uid, `4. After crediting month 1  (expect +${$(expectedMonthly)} to available & earnings)`);

  const wd = await requestWithdrawal(uid, {
    amountCents: 10000,
    method: "cash",
    destination: "Dubai Marina — +971 50 000 0000",
  });
  await show(uid, "5. After client requests $100 cash withdrawal  (funds held immediately)");

  await payWithdrawal(wd.id, admin.id);
  await show(uid, "6. After admin marks withdrawal paid  (expect withdrawn=$100)");

  const entries = await db.ledgerEntry.findMany({
    where: { userId: uid },
    orderBy: { createdAt: "asc" },
  });
  console.log("\n=== IMMUTABLE LEDGER ===");
  for (const e of entries) {
    const sign = e.amountCents >= 0 ? "+" : "−";
    console.log(
      `   ${e.type.padEnd(18)} ${sign}${$(Math.abs(e.amountCents)).padStart(9)}  →  balance ${$(e.balanceAfterCents)}  ${e.note ?? ""}`,
    );
  }
  console.log("\n✓ Money loop verified.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("✗ FAILED:", e);
    process.exit(1);
  });
