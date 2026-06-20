import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";

const COOKIE = "bf_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "dev-insecure-secret-change-me",
  );
}

export type Session = { userId: string; role: string };

/** Sign a session JWT and set it as an httpOnly cookie. */
export async function createSession(userId: string, role: string) {
  const token = await new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Read + verify the session cookie. Returns null if missing/invalid. */
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return {
      userId: payload.sub as string,
      role: (payload.role as string) ?? "client",
    };
  } catch {
    return null;
  }
}

/** Load the current user (with wallet) from the session, or null. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: { wallet: true },
  });
  // A suspended account must lose access even with a still-valid session cookie.
  if (!user || user.status !== "active") return null;
  return user;
}
