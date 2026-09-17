import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getGalleryItemForAdmin } from "@/lib/admin-data";
import { galleryItemSchema } from "@/lib/validations-admin";
import { deleteUploadedFile } from "@/lib/uploads";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const item = await getGalleryItemForAdmin(id);
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

  const parsed = galleryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const previous = await getGalleryItemForAdmin(id);
  const item = await prisma.galleryItem.update({ where: { id }, data: parsed.data }).catch(() => null);

  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // If the file itself was swapped out (not just alt text/published),
  // don't leave the old one behind on disk.
  if (previous && previous.url !== item.url) {
    await deleteUploadedFile(previous.url);
  }

  revalidateTag("gallery", "max");

  return NextResponse.json({ success: true, item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const deleted = await prisma.galleryItem.delete({ where: { id } }).catch(() => null);
  if (deleted) await deleteUploadedFile(deleted.url);

  revalidateTag("gallery", "max");

  return NextResponse.json({ success: true });
}
