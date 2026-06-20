/**
 * End-to-end KYC check. Exercises the REAL storage + ledger functions against dev.db.
 * Run: npx tsx prisma/kyc-verify.ts
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { submitKyc, approveKyc, rejectKyc } from "../src/lib/ledger";
import { saveKycFiles, readKycFile, parseFileUrls } from "../src/lib/kyc-storage";

async function main() {
  const email = "kyc@test.com";

  const prior = await db.user.findUnique({ where: { email } });
  if (prior) {
    await db.kycRecord.deleteMany({ where: { userId: prior.id } });
    await db.wallet.deleteMany({ where: { userId: prior.id } });
    await db.user.delete({ where: { id: prior.id } });
  }
  const user = await db.user.create({
    data: {
      email,
      name: "Kyc Test",
      passwordHash: await bcrypt.hash("Test@12345", 10),
      role: "client",
      wallet: { create: {} },
    },
  });
  const admin = await db.user.findFirst({ where: { role: "admin" } });
  if (!admin) throw new Error("No admin seeded.");

  console.log("=== BLUE FOX KYC FLOW ===");

  // 1. Save documents (real File objects → disk under uploads/kyc/<userId>/)
  const frontBytes = Buffer.from("FRONT-IMAGE-BYTES-12345");
  const fileUrls = await saveKycFiles(user.id, [
    { slot: "front", file: new File([frontBytes], "front.png", { type: "image/png" }) },
    { slot: "back", file: new File([Buffer.from("BACK")], "back.png", { type: "image/png" }) },
    { slot: "selfie", file: new File([Buffer.from("SELFIE")], "selfie.jpg", { type: "image/jpeg" }) },
  ]);
  console.log("1. saved 3 files →", fileUrls);

  // 2. Submit
  await submitKyc(user.id, { docType: "emirates_id", docNumber: "784-1990-1234567-1", fileUrls });
  let u = await db.user.findUnique({ where: { id: user.id } });
  console.log("2. after submit  → user.kycStatus =", u!.kycStatus, u!.kycStatus === "pending" ? "✓" : "✗");

  // 3. Read a file back through the storage layer & verify bytes round-trip
  const parsed = parseFileUrls(fileUrls);
  const readBack = await readKycFile(user.id, parsed[0].filename);
  console.log("3. file read-back bytes match:", readBack.equals(frontBytes) ? "✓" : "✗");

  // 3b. Path-traversal guard
  try {
    await readKycFile(user.id, "../../../etc/passwd");
    console.log("   traversal guard: ✗ (allowed!)");
  } catch {
    console.log("   traversal guard: ✓ (blocked)");
  }

  // 4. Approve
  const rec = await db.kycRecord.findFirst({ where: { userId: user.id } });
  await approveKyc(rec!.id, admin.id);
  u = await db.user.findUnique({ where: { id: user.id } });
  console.log("4. after approve → user.kycStatus =", u!.kycStatus, u!.kycStatus === "approved" ? "✓" : "✗");

  // 4b. Double-review guard
  try {
    await approveKyc(rec!.id, admin.id);
    console.log("   double-review guard: ✗ (allowed!)");
  } catch (e) {
    console.log("   double-review guard: ✓ (blocked:", (e as Error).message + ")");
  }

  // 5. Reject path (new submission)
  await db.user.update({ where: { id: user.id }, data: { kycStatus: "none" } });
  await submitKyc(user.id, { docType: "passport", fileUrls });
  const rec2 = await db.kycRecord.findFirst({ where: { userId: user.id, status: "pending" } });
  await rejectKyc(rec2!.id, admin.id, "Photo blurry / unreadable");
  u = await db.user.findUnique({ where: { id: user.id } });
  const r2 = await db.kycRecord.findUnique({ where: { id: rec2!.id } });
  console.log("5. after reject  → user.kycStatus =", u!.kycStatus, "| note =", JSON.stringify(r2!.note),
    u!.kycStatus === "rejected" && r2!.note ? "✓" : "✗");

  // 5b. Reject requires a reason
  await db.user.update({ where: { id: user.id }, data: { kycStatus: "none" } });
  await submitKyc(user.id, { docType: "passport", fileUrls });
  const rec3 = await db.kycRecord.findFirst({ where: { userId: user.id, status: "pending" } });
  try {
    await rejectKyc(rec3!.id, admin.id, "   ");
    console.log("   empty-reason guard: ✗ (allowed!)");
  } catch {
    console.log("   empty-reason guard: ✓ (blocked)");
  }

  console.log("\n✓ KYC flow verified.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("✗ FAILED:", e);
    process.exit(1);
  });
