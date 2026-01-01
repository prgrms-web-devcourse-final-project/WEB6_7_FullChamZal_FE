import { redirect } from "next/navigation";
import { authApiServer } from "@/lib/api/auth/auth.server";
import AdminDashboardShell from "@/components/dashboard/admin/AdminDashboardShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let me: Awaited<ReturnType<typeof authApiServer.me>>;

  try {
    me = await authApiServer.me();
  } catch {
    redirect("/auth/login");
  }

  if (me.role === "USER") redirect("/dashboard");
  if (me.role !== "ADMIN") redirect("/auth/login");

  return <AdminDashboardShell me={me}>{children}</AdminDashboardShell>;
}
