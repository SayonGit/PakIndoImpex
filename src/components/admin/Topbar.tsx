"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export function Topbar({ email }: { email: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="shadow-soft flex items-center justify-end gap-4 border-b border-ink-100 bg-white px-6 py-4">
      <span className="text-sm font-medium text-ink-500">{email}</span>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-1.5 text-sm font-semibold text-ink-700 transition-all duration-200 ease-spring hover:border-secondary-300 hover:text-secondary-700 disabled:opacity-60"
      >
        {loggingOut ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <LogOut className="size-3.5" aria-hidden />}
        Sign Out
      </button>
    </header>
  );
}
