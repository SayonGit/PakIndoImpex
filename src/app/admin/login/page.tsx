import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign In | Admin" };

export default async function AdminLoginPage() {
  const user = await getAdminSession();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/images/logo.png" alt="PT. Pakindo Impex Perkasa" width={160} height={60} className="h-12 w-auto" />
          <p className="mt-3 text-sm font-medium text-ink-500">Admin Panel</p>
        </div>
        <div className="shadow-soft-lg rounded-3xl border border-ink-100 bg-white p-8">
          <h1 className="text-xl font-bold text-ink-950">Sign in</h1>
          <p className="mt-1 text-sm text-ink-500">Manage content, submissions, and settings.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
