import { Resend } from "resend";

/**
 * TODO: Email notifications are wired up but inactive until RESEND_API_KEY
 * and NOTIFICATIONS_TO_EMAIL are set (see .env.example). Until then, form
 * submissions are still saved to the database — this is a best-effort
 * notification layer only, and every call site must not fail the request
 * if sending fails.
 */
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

type NotifyParams = {
  subject: string;
  html: string;
};

export async function sendInternalNotification({ subject, html }: NotifyParams): Promise<void> {
  const fromEmail = process.env.NOTIFICATIONS_FROM_EMAIL;
  const toEmail = process.env.NOTIFICATIONS_TO_EMAIL;

  if (!resend || !fromEmail || !toEmail) {
    console.info(
      `[email] Notification skipped ("${subject}") — RESEND_API_KEY / NOTIFICATIONS_TO_EMAIL not configured yet.`
    );
    return;
  }

  try {
    await resend.emails.send({ from: fromEmail, to: toEmail, subject, html });
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
