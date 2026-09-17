import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getTeamMemberForAdmin } from "@/lib/admin-data";
import { teamMemberSchema } from "@/lib/validations-admin";
import { deleteUploadedFile } from "@/lib/uploads";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const item = await getTeamMemberForAdmin(id);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ item });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = teamMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const previous = await getTeamMemberForAdmin(id);
  const data = { ...parsed.data, photoUrl: parsed.data.photoUrl || null };
  const item = await prisma.teamMember.update({ where: { id }, data }).catch(() => null);

  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

  if (previous?.photoUrl && previous.photoUrl !== item.photoUrl) {
    await deleteUploadedFile(previous.photoUrl);
  }

  revalidateTag("team", "max");

  return NextResponse.json({ success: true, item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const deleted = await prisma.teamMember.delete({ where: { id } }).catch(() => null);
  if (deleted?.photoUrl) await deleteUploadedFile(deleted.photoUrl);

  revalidateTag("team", "max");

  return NextResponse.json({ success: true });
}
