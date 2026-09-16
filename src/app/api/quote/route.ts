import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteRequestSchema } from "@/lib/validations";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { sendInternalNotification, renderNotificationRows } from "@/lib/email";

export async function POST(request: Request) {
  const clientKey = getClientKey(request.headers);
  const rateLimit = checkRateLimit(`quote:${clientKey}`);
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

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the required fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Honeypot: a real visitor never fills this field.
  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- dropping the honeypot field
  const { website: _website, ...data } = parsed.data;

  const quoteRequest = await prisma.quoteRequest.create({
    data: {
      ...data,
      company: data.company || null,
      phone: data.phone || null,
      quantityEstimate: data.quantityEstimate || null,
      locale: data.locale || "en",
    },
  });

  await sendInternalNotification({
    subject: `New quote request: ${data.destinationCountry}`,
    html: `<table>${renderNotificationRows({
      Name: data.name,
      Company: data.company,
      Email: data.email,
      Phone: data.phone,
      "Destination Country": data.destinationCountry,
      "Approx. Quantity / Month": data.quantityEstimate,
      "Inquiry Details": data.inquiryDetails,
    })}</table>`,
  });

  return NextResponse.json({ success: true, id: quoteRequest.id });
}
