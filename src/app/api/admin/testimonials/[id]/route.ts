import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getTestimonialForAdmin } from "@/lib/admin-data";
import { testimonialSchema } from "@/lib/validations-admin";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const item = await getTestimonialForAdmin(id);
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

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const item = await prisma.testimonial.update({ where: { id }, data: parsed.data }).catch(() => null);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

  revalidateTag("testimonials", "max");

  return NextResponse.json({ success: true, item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } }).catch(() => null);

  revalidateTag("testimonials", "max");

  return NextResponse.json({ success: true });
}
