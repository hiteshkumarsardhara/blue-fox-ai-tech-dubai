/**
 * Admin override check. Run: npx tsx prisma/admin-rent-verify.ts
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { requestDeposit, confirmDeposit, rentRobot } from "../src/lib/ledger";

async function main() {
  const email = "ovr@test.com";
  const prior = await db.user.findUnique({ where: { email } });
  if (prior) {
    await db.auditLog.deleteMany({ where: { entityType: "Contract", actorId: prior.id } });
    await db.ledgerEntry.deleteMany({ where: { userId: prior.id } });
    await db.contract.deleteMany({ where: { userId: prior.id } });
    await db.deposit.deleteMany({ where: { userId: prior.id } });
    await db.wallet.deleteMany({ where: { userId: prior.id } });
    await db.user.delete({ where: { id: prior.id } });
  }
  const user = await db.user.create({
    data: { email, name: "Ovr Test", passwordHash: await bcrypt.hash("x", 10), role: "client", wallet: { create: {} } },
  });
  const admin = await db.user.findFirst({ where: { role: "admin" } });
  const dep = await requestDeposit(user.id, { amountCents: 5_000_000, method: "usdt" });
  await confirmDeposit(dep.id, admin!.id);

  const high = await db.robot.findUnique({ where: { slug: "bf-professional" } }); // $9,999
  const low = await db.robot.findUnique({ where: { slug: "bf-beginner" } }); // $3,333

  console.log("=== ADMIN OVERRIDE ===");
  await rentRobot(user.id, high!.id);
  console.log("1. client rents $9,999 → ALLOWED ✓");

  // Client path: a lower robot must still be blocked.
  let blocked = false;
  try {
    await rentRobot(user.id, low!.id);
  } catch {
    blocked = true;
  }
  console.log("2. client tries $3,333 (lower) →", blocked ? "BLOCKED ✓" : "ALLOWED ✗");

  // Admin override: the same lower robot is allowed.
  let overrode = false;
  try {
    await rentRobot(user.id, low!.id, { actorId: admin!.id, allowAnyTier: true });
    overrode = true;
  } catch (e) {
    console.log("   override error:", (e as Error).message);
  }
  console.log("3. admin override rents $3,333 →", overrode ? "ALLOWED ✓" : "FAILED ✗");

  const adminAudit = await db.auditLog.findFirst({
    where: { action: "robot_rented_admin", actorId: admin!.id },
    orderBy: { createdAt: "desc" },
  });
  console.log("4. audit logged as robot_rented_admin:", adminAudit ? "✓" : "✗");

  console.log(blocked && overrode && adminAudit ? "\n✓ Admin override verified." : "\n✗ FAILED");
}

main().then(() => process.exit(0)).catch((e) => { console.error("✗", e); process.exit(1); });
