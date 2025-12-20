import CapsuleGate from "@/components/capsule/guest/CapsuleGate";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ uuId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { uuId } = await params;

  if (!uuId) {
    redirect("/404");
  }

  console.log(uuId);

  // 클라이언트에서 비번 여부 확인 + UI 분기
  return <CapsuleGate uuId={uuId} />;
}
