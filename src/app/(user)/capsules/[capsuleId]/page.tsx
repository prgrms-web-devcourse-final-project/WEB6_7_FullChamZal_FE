import CapsuleGate from "@/components/capsule/guest/CapsuleGate";
import { authApiServer } from "@/lib/api/auth/auth.server";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ capsuleId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { capsuleId } = await params;
  const id = Number(capsuleId);

  if (!Number.isFinite(id) || id <= 0) {
    redirect("/404"); // or notFound()
  }

  // 보호 캡슐일 수도 있으니 로그인은 일단 확보
  const me = await authApiServer.me();
  // 로그인 필수 정책이면 바로 리다이렉트
  if (!me) {
    redirect(
      `/login?callbackUrl=/dashboard/capsules/${encodeURIComponent(capsuleId)}`
    );
  }

  // 클라이언트에서 비번 여부 확인 + UI 분기
  return <CapsuleGate capsuleId={id} />;
}
