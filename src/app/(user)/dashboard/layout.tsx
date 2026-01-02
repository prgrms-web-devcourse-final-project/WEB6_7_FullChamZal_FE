import { authApiServer } from "@/lib/api/auth/auth.server";
import DashboardShell from "../../../components/dashboard/DashboardShell";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let me: MemberMe;
  try {
    me = await authApiServer.me();
  } catch {
    redirect("/auth/login");
  }

  if (me.role !== "USER") redirect("/auth/login");

  return <DashboardShell me={me}>{children}</DashboardShell>;
}
