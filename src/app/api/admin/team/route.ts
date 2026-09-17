import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllTeamMembersForAdmin } from "@/lib/admin-data";
import { teamMemberSchema } from "@/lib/validations-admin";

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const items = await getAllTeamMembersForAdmin();
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

  const parsed = teamMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const maxSortOrder = await prisma.teamMember.aggregate({ _max: { sortOrder: true } });

  const item = await prisma.teamMember.create({
    data: {
      ...parsed.data,
      photoUrl: parsed.data.photoUrl || null,
      sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidateTag("team", "max");

  return NextResponse.json({ success: true, item });
}
