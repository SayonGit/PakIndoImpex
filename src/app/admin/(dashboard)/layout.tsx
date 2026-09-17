import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-full">
      <Sidebar />
      <div className="flex min-h-full flex-1 flex-col">
        <Topbar email={user.email} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
