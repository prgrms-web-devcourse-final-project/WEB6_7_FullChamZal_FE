import { authApiServer } from "@/lib/api/auth/auth.server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
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

  // ADMIN은 관리자 대시보드로
  if (me.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <>
      <main className="w-full min-h-screen flex items-center justify-center">
        {children}
      </main>
    </>
  );
}
