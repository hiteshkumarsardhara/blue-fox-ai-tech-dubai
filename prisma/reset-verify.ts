/**
 * Password-reset flow check. Run: npx tsx prisma/reset-verify.ts
 * (Restores loop@test.com password to Test@12345 at the end.)
 */
import "dotenv/config";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { resetPasswordAction } from "../src/app/(auth)/actions";

async function issueToken(userId: string, expiresInMs = 3600_000) {
  const token = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await db.user.update({
    where: { id: userId },
    data: { resetTokenHash, resetTokenExpiresAt: new Date(Date.now() + expiresInMs) },
  });
  return token;
}

async function main() {
  const user = await db.user.findUnique({ where: { email: "loop@test.com" } });
  if (!user) throw new Error("run prisma/verify.ts first to create loop@test.com");

  console.log("=== PASSWORD RESET FLOW ===");

  // 1. Valid reset
  const token = await issueToken(user.id);
  const r1 = await resetPasswordAction({ token, password: "NewPass@123" });
  const u1 = await db.user.findUnique({ where: { id: user.id } });
  const matches = await bcrypt.compare("NewPass@123", u1!.passwordHash);
  console.log("1. valid token resets password:", r1.ok && matches && !u1!.resetTokenHash ? "✓" : "✗");

  // 2. Token is single-use (already consumed)
  const r2 = await resetPasswordAction({ token, password: "Another@123" });
  console.log("2. consumed token rejected:", !r2.ok ? "✓" : "✗");

  // 3. Expired token rejected
  const token2 = await issueToken(user.id, -1000);
  const r3 = await resetPasswordAction({ token: token2, password: "X@123456" });
  console.log("3. expired token rejected:", !r3.ok ? "✓" : "✗");

  // 4. Garbage token rejected
  const r4 = await resetPasswordAction({ token: "deadbeef", password: "X@123456" });
  console.log("4. invalid token rejected:", !r4.ok ? "✓" : "✗");

  // 5. Short password rejected
  const token3 = await issueToken(user.id);
  const r5 = await resetPasswordAction({ token: token3, password: "123" });
  console.log("5. short password rejected:", !r5.ok ? "✓" : "✗");

  // Restore so loop@test stays usable for UI tests.
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash("Test@12345", 10), resetTokenHash: null, resetTokenExpiresAt: null },
  });
  console.log("\n✓ Reset flow verified (loop@test.com password restored to Test@12345).");
}

main().then(() => process.exit(0)).catch((e) => { console.error("✗", e); process.exit(1); });
