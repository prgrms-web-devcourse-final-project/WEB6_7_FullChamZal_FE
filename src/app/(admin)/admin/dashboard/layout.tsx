import { redirect } from "next/navigation";
import AdminSidebar from "@/components/dashboard/admin/sidebar/AdminSidebar";
import { authApiServer } from "@/lib/api/auth/auth.server";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let me;

  try {
    me = await authApiServer.me();
  } catch {
    // 로그인 안 된 경우
    redirect("/auth/login");
  }

  // USER면 일반 대시보드로
  if (me.role === "USER") {
    redirect("/dashboard");
  }

  // ADMIN만 통과
  if (me.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <main className="relative w-full h-screen flex overflow-hidden">
      <AdminSidebar />
      <section className="flex-1 h-full overflow-x-hidden overflow-y-auto">
        <div className="p-8">{children}</div>
      </section>
    </main>
  );
}
