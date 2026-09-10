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
      quality: data.quality || null,
      specification: data.specification || null,
      packaging: data.packaging || null,
      destinationPort: data.destinationPort || null,
      incoterm: data.incoterm || null,
      targetDeliveryDate: data.targetDeliveryDate || null,
      additionalRequirements: data.additionalRequirements || null,
      locale: data.locale || "en",
    },
  });

  await sendInternalNotification({
    subject: `New quote request: ${data.product} (${data.country})`,
    html: `<table>${renderNotificationRows({
      Name: data.name,
      Company: data.company,
      Email: data.email,
      Phone: data.phone,
      Country: data.country,
      Product: data.product,
      Quantity: data.quantity,
      Quality: data.quality,
      Specification: data.specification,
      Packaging: data.packaging,
      "Destination Port": data.destinationPort,
      Incoterm: data.incoterm,
      "Target Delivery Date": data.targetDeliveryDate,
      "Additional Requirements": data.additionalRequirements,
    })}</table>`,
  });

  return NextResponse.json({ success: true, id: quoteRequest.id });
}
