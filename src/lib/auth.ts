import { randomBytes, scrypt, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { AdminUser } from "@prisma/client";

export const ADMIN_SESSION_COOKIE = "pk_admin_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SCRYPT_KEY_LENGTH = 64;

function scryptAsync(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, SCRYPT_KEY_LENGTH, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hashHex] = storedHash.split(":");
  if (!salt || !hashHex) return false;
  const derivedKey = await scryptAsync(password, salt);
  const storedKey = Buffer.from(hashHex, "hex");
  if (storedKey.length !== derivedKey.length) return false;
  return timingSafeEqual(storedKey, derivedKey);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Creates a session row and returns the raw token to set on the cookie. */
export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.adminSession.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });
  return { token, expiresAt };
}

export async function destroySessionByToken(token: string): Promise<void> {
  await prisma.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } });
}

/** Looks up the session cookie and returns the signed-in admin, or null. Does not redirect. */
export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session.user;
}
