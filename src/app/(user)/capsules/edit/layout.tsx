import { authApiServer } from "@/lib/api/auth/auth.server";
import { redirect } from "next/navigation";

export default async function CapsulesEditLayout({
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

  return <>{children}</>;
}

