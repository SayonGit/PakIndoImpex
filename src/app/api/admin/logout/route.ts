import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySessionByToken, ADMIN_SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) await destroySessionByToken(token);

  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
