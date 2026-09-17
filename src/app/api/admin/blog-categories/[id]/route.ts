import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { blogCategorySchema } from "@/lib/validations-admin";

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

  const parsed = blogCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const item = await prisma.blogCategory.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ error: "That category already exists." }, { status: 409 });
      }
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Not found." }, { status: 404 });
      }
    }
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  await prisma.blogCategory.delete({ where: { id } }).catch(() => null);

  return NextResponse.json({ success: true });
}
