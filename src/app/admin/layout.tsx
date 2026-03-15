import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("staff_token")?.value;

  if (!token) redirect("/admin/login");

  const payload = await verifyAdminToken(token);
  if (!payload) redirect("/admin/login");

  const user = {
    firstName: payload.firstName as string,
    lastName: payload.lastName as string,
    email: payload.email as string,
    role: payload.role as string,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
