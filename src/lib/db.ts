import path from "node:path";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Prisma 7 client with the SQLite driver adapter (dev).
 * The sqlite file is resolved to an ABSOLUTE path so it opens regardless of the
 * process working directory. Production: switch the datasource provider +
 * adapter to MySQL/PostgreSQL.
 */
const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const url = rawUrl.startsWith("file:")
  ? "file:" + path.resolve(process.cwd(), rawUrl.slice("file:".length))
  : rawUrl;

const adapter = new PrismaBetterSqlite3({ url });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
