import { redirect } from "next/navigation";
import AdminSidebar from "@/components/dashboard/admin/sidebar/AdminSidebar";
import { ApiError } from "@/lib/api/fetchClient";
import { authApi } from "@/lib/api/auth/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let me;

  try {
    me = await authApi.me();
  } catch (e) {
    // 로그인 안 된 상태
    if (e instanceof ApiError && e.status === 401) {
      redirect("/auth/login");
    }
    // 그 외 에러도 로그인으로
    redirect("/auth/login");
  }

  // ADMIN 체크
  if (me.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <>
      <main className="relative w-full h-screen flex overflow-hidden">
        <AdminSidebar />
        <section className="flex-1 h-full overflow-x-hidden overflow-y-auto">
          <div className="p-8">{children}</div>
        </section>
      </main>
    </>
  );
}
