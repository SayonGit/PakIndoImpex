import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getArticleForAdmin } from "@/lib/admin-data";
import { articleSchema } from "@/lib/validations-admin";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { deleteUploadedFile } from "@/lib/uploads";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const article = await getArticleForAdmin(id);
  if (!article) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ article });
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

  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const previous = await getArticleForAdmin(id);
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...parsed.data,
        content: sanitizeArticleHtml(parsed.data.content),
        coverImageUrl: parsed.data.coverImageUrl || null,
        publishDate: new Date(parsed.data.publishDate),
      },
    });

    if (previous?.coverImageUrl && previous.coverImageUrl !== article.coverImageUrl) {
      await deleteUploadedFile(previous.coverImageUrl);
    }

    revalidateTag("articles", "max");

    return NextResponse.json({ success: true, article });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
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
  const deleted = await prisma.article.delete({ where: { id } }).catch(() => null);
  if (deleted?.coverImageUrl) await deleteUploadedFile(deleted.coverImageUrl);

  revalidateTag("articles", "max");

  return NextResponse.json({ success: true });
}
