import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validations-admin";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

// Constant-shape placeholder so a lookup miss takes about as long as a real
// verify — avoids letting response timing reveal whether an email exists.
const DUMMY_HASH = `${"0".repeat(32)}:${"0".repeat(128)}`;

export async function POST(request: Request) {
  const clientKey = getClientKey(request.headers);
  const rateLimit = checkRateLimit(`admin-login:${clientKey}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 600) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter your email and password." }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  const isValid = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !isValid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const { token, expiresAt } = await createSession(user.id);
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return response;
}
