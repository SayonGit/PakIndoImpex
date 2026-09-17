import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettingsForAdmin, getSiteSettingsForAdminMasked } from "@/lib/admin-data";
import { siteSettingsSchema } from "@/lib/validations-admin";
import { deleteUploadedFile } from "@/lib/uploads";

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const settings = await getSiteSettingsForAdminMasked();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { smtpPassword, smtpPort, ...rest } = parsed.data;

  const baseData = {
    ...rest,
    facebookUrl: rest.facebookUrl || null,
    instagramUrl: rest.instagramUrl || null,
    twitterUrl: rest.twitterUrl || null,
    youtubeUrl: rest.youtubeUrl || null,
    logoUrl: rest.logoUrl || null,
    faviconUrl: rest.faviconUrl || null,
    smtpHost: rest.smtpHost || null,
    smtpPort: smtpPort === "" || smtpPort === undefined ? null : smtpPort,
    smtpUser: rest.smtpUser || null,
    smtpFromName: rest.smtpFromName || null,
    smtpFromEmail: rest.smtpFromEmail || null,
    notifyToEmail: rest.notifyToEmail || null,
  };

  const previous = await getSiteSettingsForAdmin();

  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    // Blank password field = keep whatever's already saved.
    update: { ...baseData, ...(smtpPassword ? { smtpPassword } : {}) },
    create: { id: 1, ...baseData, smtpPassword: smtpPassword || null },
  });

  // A replaced or removed logo/favicon leaves its old file orphaned on
  // disk unless we clean it up here.
  if (previous?.logoUrl && previous.logoUrl !== settings.logoUrl) {
    await deleteUploadedFile(previous.logoUrl);
  }
  if (previous?.faviconUrl && previous.faviconUrl !== settings.faviconUrl) {
    await deleteUploadedFile(previous.faviconUrl);
  }

  // Next 16's revalidateTag requires a cache-life profile as the 2nd arg;
  // "max" purges every cached entry under this tag regardless of profile.
  revalidateTag("settings", "max");

  const { smtpPassword: savedPassword, ...settingsRest } = settings;
  return NextResponse.json({
    success: true,
    settings: { ...settingsRest, smtpPassword: "", smtpPasswordSet: Boolean(savedPassword) },
  });
}
