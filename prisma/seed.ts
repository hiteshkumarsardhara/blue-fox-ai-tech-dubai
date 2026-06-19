import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const db = new PrismaClient({ adapter });

const PACKAGES = [
  { slug: "bf-beginner", name: "Bf Beginner Bot", tier: "Golden", deposit: 3333, monthlyRoi: 4, contractMonths: 18, sortOrder: 1 },
  { slug: "bf-trader", name: "Bf Trader Bot", tier: "Golden", deposit: 5555, monthlyRoi: 4.5, contractMonths: 18, sortOrder: 2 },
  { slug: "bf-ex-trader", name: "Bf Ex. Trader Bot", tier: "Golden", deposit: 7777, monthlyRoi: 5, contractMonths: 18, sortOrder: 3, highlight: true },
  { slug: "bf-professional", name: "Bf Professional Bot", tier: "Golden", deposit: 9999, monthlyRoi: 5.5, contractMonths: 18, sortOrder: 4 },
  { slug: "bf-expert", name: "Bf Expert Bot", tier: "Diamond", deposit: 11111, monthlyRoi: 6, contractMonths: 24, sortOrder: 5 },
  { slug: "bf-talent", name: "Bf Talent Bot", tier: "Diamond", deposit: 22222, monthlyRoi: 6.5, contractMonths: 24, sortOrder: 6 },
  { slug: "bf-tycoon", name: "Bf Tycoon Bot", tier: "Diamond", deposit: 33333, monthlyRoi: 7, contractMonths: 24, sortOrder: 7, highlight: true },
  { slug: "bf-infinity", name: "Bf Infinity Bot", tier: "Diamond", deposit: 55555, monthlyRoi: 8, contractMonths: 24, sortOrder: 8 },
];

const SETTINGS = [
  { key: "registration_fee_cents", value: "2000" },
  { key: "currency", value: "USD" },
  { key: "deposit_usdt_trc20", value: "" },
  { key: "deposit_usdt_erc20", value: "" },
  { key: "deposit_bank_details", value: "" },
];

async function main() {
  for (const p of PACKAGES) {
    const data = {
      name: p.name,
      tier: p.tier,
      depositCents: p.deposit * 100,
      monthlyRoi: p.monthlyRoi,
      contractMonths: p.contractMonths,
      highlight: !!p.highlight,
      sortOrder: p.sortOrder,
      status: "active",
    };
    await db.robot.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
  }

  for (const s of SETTINGS) {
    await db.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  const adminEmail = "admin@bluefoxdubai.com";
  const passwordHash = await bcrypt.hash("Admin@12345", 10);
  await db.user.upsert({
    where: { email: adminEmail },
    update: { role: "admin" },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Blue Fox Admin",
      role: "admin",
      termsAcceptedAt: new Date(),
    },
  });

  console.log(`Seeded: ${PACKAGES.length} robots, ${SETTINGS.length} settings, admin=${adminEmail} (password: Admin@12345)`);
}

main()
  .then(() => db.$disconnect())
  .catch((e) => {
    console.error(e);
    return db.$disconnect().finally(() => process.exit(1));
  });
