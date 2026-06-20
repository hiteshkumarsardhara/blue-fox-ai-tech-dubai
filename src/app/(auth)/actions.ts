"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";

export type ActionResult =
  | { ok: true; role?: string }
  | { ok: false; error: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function registerAction(input: {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  password: string;
  referralCode?: string;
}): Promise<ActionResult> {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();

  if (!name) return { ok: false, error: "Please enter your full name." };
  if (!email || !EMAIL_RE.test(email))
    return { ok: false, error: "Please enter a valid email address." };
  if (!input.password || input.password.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing)
    return { ok: false, error: "An account with this email already exists." };

  // Resolve an optional referrer; silently ignore an unknown code.
  let referredById: string | null = null;
  const code = input.referralCode?.trim();
  if (code) {
    const referrer = await db.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });
    if (referrer) referredById = referrer.id;
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      name,
      phone: input.phone?.trim() || null,
      country: input.country?.trim() || null,
      termsAcceptedAt: new Date(),
      referredById,
      wallet: { create: {} },
    },
  });

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "user_registered",
      entityType: "User",
      entityId: user.id,
    },
  });

  await createSession(user.id, user.role);
  return { ok: true, role: user.role };
}

export async function loginAction(input: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  const email = input.email?.trim().toLowerCase();
  if (!email || !input.password)
    return { ok: false, error: "Enter your email and password." };

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { ok: false, error: "Invalid email or password." };

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) return { ok: false, error: "Invalid email or password." };

  if (user.status !== "active")
    return { ok: false, error: "Your account is not active. Contact support." };

  await createSession(user.id, user.role);
  return { ok: true, role: user.role };
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
