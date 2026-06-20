/**
 * Upgrade-only rule check. Run: npx tsx prisma/upgrade-verify.ts
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { requestDeposit, confirmDeposit, rentRobot } from "../src/lib/ledger";

const $ = (c: number) => "$" + (c / 100).toFixed(2);

async function tryRent(userId: string, slug: string) {
  const robot = await db.robot.findUnique({ where: { slug } });
  try {
    await rentRobot(userId, robot!.id);
    return { ok: true, deposit: robot!.depositCents };
  } catch (e) {
    return { ok: false, deposit: robot!.depositCents, error: (e as Error).message };
  }
}

async function main() {
  const email = "upg@test.com";
  const prior = await db.user.findUnique({ where: { email } });
  if (prior) {
    await db.ledgerEntry.deleteMany({ where: { userId: prior.id } });
    await db.contract.deleteMany({ where: { userId: prior.id } });
    await db.deposit.deleteMany({ where: { userId: prior.id } });
    await db.wallet.deleteMany({ where: { userId: prior.id } });
    await db.user.delete({ where: { id: prior.id } });
  }
  const user = await db.user.create({
    data: { email, name: "Upg Test", passwordHash: await bcrypt.hash("x", 10), role: "client", wallet: { create: {} } },
  });
  const admin = await db.user.findFirst({ where: { role: "admin" } });
  const dep = await requestDeposit(user.id, { amountCents: 20_000_000, method: "usdt" }); // $200k
  await confirmDeposit(dep.id, admin!.id);

  console.log("=== UPGRADE-ONLY RULE ===");

  const steps: Array<[string, string, boolean]> = [
    // slug, label, expectOk
    ["bf-ex-trader", "rent $7,777 (first robot)", true],
    ["bf-beginner", "rent $3,333 (cheaper → downgrade)", false],
    ["bf-ex-trader", "rent $7,777 (equal)", true],
    ["bf-professional", "rent $9,999 (upgrade)", true],
    ["bf-trader", "rent $5,555 (cheaper than $9,999 → downgrade)", false],
  ];

  let allPass = true;
  for (const [slug, label, expectOk] of steps) {
    const r = await tryRent(user.id, slug);
    const pass = r.ok === expectOk;
    allPass = allPass && pass;
    console.log(`${pass ? "✓" : "✗"} ${label} → ${r.ok ? "ALLOWED" : "BLOCKED"}${r.ok ? "" : ` (${r.error})`}`);
  }

  console.log(allPass ? "\n✓ Upgrade-only rule verified." : "\n✗ RULE FAILED");
}

main().then(() => process.exit(0)).catch((e) => { console.error("✗", e); process.exit(1); });
