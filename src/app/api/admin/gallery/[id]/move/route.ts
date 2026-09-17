import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

const moveSchema = z.object({ direction: z.enum(["up", "down"]) });

/** Swaps this item's sortOrder with its immediate neighbor in that direction. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = moveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid direction." }, { status: 400 });
  }

  const current = await prisma.galleryItem.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const neighbor = await prisma.galleryItem.findFirst({
    where:
      parsed.data.direction === "up"
        ? { sortOrder: { lt: current.sortOrder } }
        : { sortOrder: { gt: current.sortOrder } },
    orderBy: { sortOrder: parsed.data.direction === "up" ? "desc" : "asc" },
  });

  if (neighbor) {
    await prisma.$transaction([
      prisma.galleryItem.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
      prisma.galleryItem.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
    ]);
  }

  revalidateTag("gallery", "max");

  return NextResponse.json({ success: true });
}
