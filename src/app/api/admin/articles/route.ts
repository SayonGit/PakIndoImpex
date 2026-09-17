import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllArticlesForAdmin } from "@/lib/admin-data";
import { articleSchema } from "@/lib/validations-admin";
import { sanitizeArticleHtml } from "@/lib/sanitize";

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const items = await getAllArticlesForAdmin();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

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
    const article = await prisma.article.create({
      data: {
        ...parsed.data,
        content: sanitizeArticleHtml(parsed.data.content),
        coverImageUrl: parsed.data.coverImageUrl || null,
        publishDate: new Date(parsed.data.publishDate),
      },
    });

    revalidateTag("articles", "max");

    return NextResponse.json({ success: true, article });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    throw error;
  }
}
