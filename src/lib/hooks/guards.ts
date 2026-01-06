import { authApiServer } from "@/lib/api/auth/auth.server";
import { redirect } from "next/navigation";

export async function requireCapsuleUser() {
  let me;

  try {
    me = await authApiServer.me();
  } catch {
    redirect("/auth/login");
  }

  // 관리자 분기
  if (me.role === "ADMIN") {
    redirect("/admin/dashboard/users");
  }

  // 일반 사용자 접근 조건
  if (me.role !== "USER" || me.status === "STOP") {
    redirect("/auth/login");
  }

  // 프로필 필수 정보 체크
  if (!me.nickname || !me.phoneNumber) {
    redirect("/dashboard");
  }

  return me;
}
