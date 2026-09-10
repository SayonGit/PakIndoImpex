import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validations";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { sendInternalNotification, renderNotificationRows } from "@/lib/email";

export async function POST(request: Request) {
  const clientKey = getClientKey(request.headers);
  const rateLimit = checkRateLimit(`contact:${clientKey}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 600) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the required fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- dropping the honeypot field
  const { website: _website, ...data } = parsed.data;

  const message = await prisma.contactMessage.create({
    data: {
      ...data,
      phone: data.phone || null,
      country: data.country || null,
      subject: data.subject || null,
      locale: data.locale || "en",
    },
  });

  await sendInternalNotification({
    subject: `New contact message${data.subject ? `: ${data.subject}` : ""}`,
    html: `<table>${renderNotificationRows({
      Name: data.name,
      Email: data.email,
      Phone: data.phone,
      Country: data.country,
      Subject: data.subject,
      Message: data.message,
    })}</table>`,
  });

  return NextResponse.json({ success: true, id: message.id });
}
