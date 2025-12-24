import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { authApiServer } from "@/lib/api/auth/auth.server";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let me;
  try {
    me = await authApiServer.me();
  } catch {
    redirect("/auth/login");
  }

  if (me.role !== "USER") redirect("/auth/login");

  return (
    <DashboardShell me={me}>
      <main className="relative w-full h-screen flex overflow-hidden">
        <Sidebar me={me} />
        <section className="flex-1 h-full overflow-y-auto">{children}</section>
      </main>
    </DashboardShell>
  );
}
