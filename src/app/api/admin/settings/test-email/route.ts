import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettingsForAdmin } from "@/lib/admin-data";
import { testEmailSchema } from "@/lib/validations-admin";

/**
 * Sends a one-off test email using whatever SMTP values are currently
 * typed into the Settings form — even if they haven't been saved yet. A
 * blank password in the request means "use the already-saved one" (the
 * form never has the real saved password to send back in the first
 * place — see the settings route's GET masking).
 */
export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = testEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the SMTP fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  let password = parsed.data.smtpPassword;
  if (!password) {
    const saved = await getSiteSettingsForAdmin();
    password = saved?.smtpPassword ?? "";
  }
  if (!password) {
    return NextResponse.json({ error: "Enter a password, or save one first." }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: parsed.data.smtpHost,
      port: parsed.data.smtpPort,
      secure: parsed.data.smtpSecure,
      auth: { user: parsed.data.smtpUser, pass: password },
    });

    const fromName = parsed.data.smtpFromName || "Pakindo Impex Website";
    await transporter.sendMail({
      from: `"${fromName}" <${parsed.data.smtpFromEmail}>`,
      to: parsed.data.to,
      subject: "Test email from Pakindo Impex admin panel",
      html: "<p>This is a test email confirming your SMTP settings are working.</p>",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send the test email.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
