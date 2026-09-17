import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { pageSeoSchema } from "@/lib/validations-admin";

export async function PUT(request: Request) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = pageSeoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { path, seoTitle, seoDescription } = parsed.data;
  const data = { seoTitle: seoTitle || null, seoDescription: seoDescription || null };

  const pageSeo = await prisma.pageSeo.upsert({
    where: { path },
    update: data,
    create: { path, ...data },
  });

  revalidateTag("page-seo", "max");

  return NextResponse.json({ success: true, pageSeo });
}
