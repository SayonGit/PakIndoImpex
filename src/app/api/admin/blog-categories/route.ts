import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllBlogCategoriesForAdmin } from "@/lib/admin-data";
import { blogCategorySchema } from "@/lib/validations-admin";

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const items = await getAllBlogCategoriesForAdmin();
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

  const parsed = blogCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const item = await prisma.blogCategory.create({ data: parsed.data });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "That category already exists." }, { status: 409 });
    }
    throw error;
  }
}
