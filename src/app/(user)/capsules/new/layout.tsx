import { authApiServer } from "@/lib/api/auth/auth.server";
import { redirect } from "next/navigation";

export default async function CapsulesNewLayout({
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
  if (me.status === "STOP") redirect("/auth/login");
  if (!me.nickname || !me.phoneNumber) redirect("/dashboard");

  return <>{children}</>;
}
