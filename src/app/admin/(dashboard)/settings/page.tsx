import type { Metadata } from "next";
import { getSiteSettingsForAdminMasked, type AdminSiteSettings } from "@/lib/admin-data";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Settings | Admin" };

const FALLBACK: AdminSiteSettings = {
  id: 1,
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  shortAddress: "",
  businessHours: "",
  facebookUrl: null,
  instagramUrl: null,
  twitterUrl: null,
  youtubeUrl: null,
  logoUrl: null,
  faviconUrl: null,
  smtpHost: null,
  smtpPort: null,
  smtpSecure: false,
  smtpUser: null,
  smtpPassword: "",
  smtpPasswordSet: false,
  smtpFromName: null,
  smtpFromEmail: null,
  notifyToEmail: null,
  updatedAt: new Date(),
};

export default async function AdminSettingsPage() {
  const settings = (await getSiteSettingsForAdminMasked()) ?? FALLBACK;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-ink-950">Settings</h1>
      <p className="mt-1 text-sm text-ink-500">
        Company contact info, social links, logo, and favicon shown across the site.
      </p>
      <div className="mt-8">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
