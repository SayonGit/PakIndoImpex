import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

type NotifyParams = {
  subject: string;
  html: string;
};

/**
 * Form submissions must never fail because email is unreachable — every
 * call site awaits this but this function itself never throws. SMTP
 * settings come straight from the DB (see /admin/settings), read fresh on
 * every send since this isn't a page render that benefits from caching and
 * a just-saved config should take effect immediately.
 */
export async function sendInternalNotification({ subject, html }: NotifyParams): Promise<void> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  if (!settings?.smtpHost || !settings.smtpPort || !settings.smtpUser || !settings.smtpPassword || !settings.smtpFromEmail) {
    console.info(`[email] Notification skipped ("${subject}") — SMTP isn't fully configured yet (see /admin/settings).`);
    return;
  }
  if (!settings.notifyToEmail) {
    console.info(`[email] Notification skipped ("${subject}") — no notification recipient set (see /admin/settings).`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpSecure,
      auth: { user: settings.smtpUser, pass: settings.smtpPassword },
    });

    const fromName = settings.smtpFromName || "Pakindo Impex Website";
    await transporter.sendMail({
      from: `"${fromName}" <${settings.smtpFromEmail}>`,
      to: settings.notifyToEmail,
      subject,
      html,
    });
  } catch (error) {
    console.error("[email] Failed to send internal notification", error);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderNotificationRows(fields: Record<string, string | undefined>): string {
  return Object.entries(fields)
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#5c594f;white-space:nowrap;">${escapeHtml(
          label
        )}</td><td style="padding:4px 0;color:#1c1b17;">${escapeHtml(String(value))}</td></tr>`
    )
    .join("");
}
