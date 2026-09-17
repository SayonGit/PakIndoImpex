import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { submissionStatusSchema } from "@/lib/validations-admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = submissionStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const item = await prisma.contactMessage
    .update({ where: { id }, data: { status: parsed.data.status } })
    .catch(() => null);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ success: true, item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  await prisma.contactMessage.delete({ where: { id } }).catch(() => null);

  return NextResponse.json({ success: true });
}
