import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllTestimonialsForAdmin } from "@/lib/admin-data";
import { testimonialSchema } from "@/lib/validations-admin";

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const items = await getAllTestimonialsForAdmin();
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

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const maxSortOrder = await prisma.testimonial.aggregate({ _max: { sortOrder: true } });

  const item = await prisma.testimonial.create({
    data: { ...parsed.data, sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1 },
  });

  revalidateTag("testimonials", "max");

  return NextResponse.json({ success: true, item });
}
