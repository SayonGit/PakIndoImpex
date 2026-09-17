"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Save, CheckCircle2, Send } from "lucide-react";
import { TextField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { AdminSiteSettings } from "@/lib/admin-data";

type Status = "idle" | "loading" | "success" | "error";

export function SettingsForm({ initial }: { initial: AdminSiteSettings }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(initial.logoUrl);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(initial.faviconUrl);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const [smtp, setSmtp] = useState({
    host: initial.smtpHost ?? "",
    port: initial.smtpPort?.toString() ?? "",
    secure: initial.smtpSecure,
    user: initial.smtpUser ?? "",
    password: "",
    fromName: initial.smtpFromName ?? "",
    fromEmail: initial.smtpFromEmail ?? "",
    notifyToEmail: initial.notifyToEmail ?? "",
  });
  const [passwordSet, setPasswordSet] = useState(initial.smtpPasswordSet);
  // Once a From Email already exists (saved, or the admin types their own),
  // stop overwriting it when SMTP Username changes.
  const [fromEmailTouched, setFromEmailTouched] = useState(Boolean(initial.smtpFromEmail));

  const [testTo, setTestTo] = useState(initial.notifyToEmail ?? "");
  const [testStatus, setTestStatus] = useState<Status>("idle");
  const [testError, setTestError] = useState<string | null>(null);

  function updateSmtp<K extends keyof typeof smtp>(key: K, value: (typeof smtp)[K]) {
    setSmtp((prev) => ({ ...prev, [key]: value }));
  }

  function handleUserChange(value: string) {
    setSmtp((prev) => ({ ...prev, user: value, fromEmail: fromEmailTouched ? prev.fromEmail : value }));
  }

  function handleFromEmailChange(value: string) {
    setFromEmailTouched(true);
    updateSmtp("fromEmail", value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      ...Object.fromEntries(formData.entries()),
      logoUrl: logoUrl ?? "",
      faviconUrl: faviconUrl ?? "",
      smtpHost: smtp.host,
      smtpPort: smtp.port,
      smtpSecure: smtp.secure,
      smtpUser: smtp.user,
      smtpPassword: smtp.password,
      smtpFromName: smtp.fromName,
      smtpFromEmail: smtp.fromEmail,
      notifyToEmail: smtp.notifyToEmail,
    };

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      if (result.settings) {
        setPasswordSet(Boolean(result.settings.smtpPasswordSet));
        setSmtp((prev) => ({ ...prev, password: "" }));
      }
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  async function handleTestEmail() {
    setTestStatus("loading");
    setTestError(null);

    try {
      const response = await fetch("/api/admin/settings/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtpHost: smtp.host,
          smtpPort: smtp.port,
          smtpSecure: smtp.secure,
          smtpUser: smtp.user,
          smtpPassword: smtp.password,
          smtpFromName: smtp.fromName,
          smtpFromEmail: smtp.fromEmail,
          to: testTo,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setTestError(result.error ?? "Could not send the test email.");
        setTestStatus("error");
        return;
      }
      setTestStatus("success");
    } catch {
      setTestError("Could not send the test email.");
      setTestStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="shadow-soft rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="text-sm font-bold tracking-wide text-ink-500 uppercase">Branding</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <ImageUploadField
            label="Logo"
            value={logoUrl}
            onChange={setLogoUrl}
            category="logo"
            hint="PNG or SVG with a transparent background works best."
          />
          <ImageUploadField
            label="Favicon"
            value={faviconUrl}
            onChange={setFaviconUrl}
            category="favicon"
            hint="Square PNG or ICO, at least 32x32."
          />
        </div>
      </section>

      <section className="shadow-soft rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="text-sm font-bold tracking-wide text-ink-500 uppercase">Contact Info</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <TextField label="Phone" name="phone" defaultValue={initial.phone} required />
          <TextField label="WhatsApp" name="whatsapp" defaultValue={initial.whatsapp} required />
          <TextField label="Email" name="email" type="email" defaultValue={initial.email} required />
          <TextField label="Short Address" name="shortAddress" defaultValue={initial.shortAddress} required />
          <TextField
            label="Full Address"
            name="address"
            defaultValue={initial.address}
            required
            className="sm:col-span-2"
          />
          <TextField
            label="Business Hours"
            name="businessHours"
            defaultValue={initial.businessHours}
            required
            className="sm:col-span-2"
          />
        </div>
      </section>

      <section className="shadow-soft rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="text-sm font-bold tracking-wide text-ink-500 uppercase">Social Links</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <TextField
            label="Facebook URL"
            name="facebookUrl"
            type="url"
            defaultValue={initial.facebookUrl ?? ""}
            placeholder="https://facebook.com/..."
          />
          <TextField
            label="Instagram URL"
            name="instagramUrl"
            type="url"
            defaultValue={initial.instagramUrl ?? ""}
            placeholder="https://instagram.com/..."
          />
          <TextField
            label="Twitter / X URL"
            name="twitterUrl"
            type="url"
            defaultValue={initial.twitterUrl ?? ""}
            placeholder="https://x.com/..."
          />
          <TextField
            label="YouTube URL"
            name="youtubeUrl"
            type="url"
            defaultValue={initial.youtubeUrl ?? ""}
            placeholder="https://youtube.com/..."
          />
        </div>
      </section>

      <section className="shadow-soft rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="text-sm font-bold tracking-wide text-ink-500 uppercase">Email Notifications (SMTP)</h2>
        <p className="mt-1 text-xs text-ink-500">
          Sent right after someone submits the Request a Quote or Contact form. Submissions always save even if this
          isn&apos;t set up.
        </p>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <TextField
            label="SMTP Host"
            name="smtpHost_"
            value={smtp.host}
            onChange={(event) => updateSmtp("host", event.target.value)}
            placeholder="smtp.example.com"
          />
          <TextField
            label="SMTP Port"
            name="smtpPort_"
            type="number"
            value={smtp.port}
            onChange={(event) => updateSmtp("port", event.target.value)}
            placeholder="587"
          />
          <TextField
            label="SMTP Username"
            name="smtpUser_"
            value={smtp.user}
            onChange={(event) => handleUserChange(event.target.value)}
          />
          <TextField
            label="SMTP Password"
            name="smtpPassword_"
            type="password"
            value={smtp.password}
            onChange={(event) => updateSmtp("password", event.target.value)}
            placeholder={passwordSet ? "•••••••• (saved — leave blank to keep it)" : "Not set"}
          />
          <TextField
            label="From Name"
            name="smtpFromName_"
            value={smtp.fromName}
            onChange={(event) => updateSmtp("fromName", event.target.value)}
            placeholder="Pakindo Impex Website"
          />
          <TextField
            label="From Email"
            name="smtpFromEmail_"
            type="email"
            value={smtp.fromEmail}
            onChange={(event) => handleFromEmailChange(event.target.value)}
            placeholder="notifications@pakindoimpex.com"
          />
          <TextField
            label="Notify This Email"
            name="notifyToEmail_"
            type="email"
            value={smtp.notifyToEmail}
            onChange={(event) => updateSmtp("notifyToEmail", event.target.value)}
            hint="Where new Quote/Contact submissions get sent."
            className="sm:col-span-2"
          />
        </div>

        <label className="mt-5 flex items-center gap-2.5 text-sm font-semibold text-ink-800">
          <input
            type="checkbox"
            checked={smtp.secure}
            onChange={(event) => updateSmtp("secure", event.target.checked)}
            className="size-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
          />
          Use SSL/TLS (usually on for port 465, off for 587)
        </label>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-5">
          <TextField
            label="Send a test email to"
            name="testTo"
            type="email"
            value={testTo}
            onChange={(event) => setTestTo(event.target.value)}
            className="flex-1"
          />
          <button
            type="button"
            onClick={handleTestEmail}
            disabled={testStatus === "loading" || !testTo}
            className="mt-6 flex items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-all duration-200 ease-spring hover:border-primary-300 hover:text-primary-700 disabled:opacity-60"
          >
            {testStatus === "loading" ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <Send className="size-3.5" aria-hidden />
            )}
            Send Test Email
          </button>
          {testStatus === "success" && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-700">
              <CheckCircle2 className="size-4" aria-hidden />
              Sent — check the inbox.
            </span>
          )}
          {testError && <span className="text-sm font-medium text-secondary-600">{testError}</span>}
        </div>
      </section>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          Save Changes
        </Button>
        {status === "success" && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-700">
            <CheckCircle2 className="size-4" aria-hidden />
            Saved
          </span>
        )}
        {error && <span className="text-sm font-medium text-secondary-600">{error}</span>}
      </div>
    </form>
  );
}
