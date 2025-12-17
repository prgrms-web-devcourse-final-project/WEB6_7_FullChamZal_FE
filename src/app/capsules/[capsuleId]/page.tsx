// app/capsule/[capsuleId]/page.tsx
import LetterDetailView from "@/components/capsule/detail/LetterDetailView";

import { redirect, notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ capsuleId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { capsuleId } = await params;

  /* const capsule = dummyCapsules.find((c) => c.id === Number(capsuleId)); */

  // 1) 편지 조회 => 편지 없으면 x
  // const letter = await getCapsuleById(capsuleId);
  /* if (!capsule) notFound(); */

  // 2) isProtected === 0이면 비회원 컴포넌트 보여주기
  // if (!capsule.isProtected) {
  /*  return <LetterDetailView capsule={capsule} mode="public" />; */
  // }

  // 3) isProtected === 1이면 회원인지 확인하기
  /* const user = await getCurrentUser();
  // 로그인이 되어있지 않으면 
  if (!user) {
    // 로그인 후 다시 돌아오게 해서
    redirect(`/login?callbackUrl=/dashboard/capsules/${encodeURIComponent(capsuleId)}`);
  } */

  // 로그인이 되어 있거나 로그인을 하게 해서 로그인 후에 다시 돌이왔을 때, 수신자 검증하기
  /* const isRecipient = capsule.toUserId === user.id;
  if (!isRecipient) {
    return <CapsuleForbidden />;
  } */

  // 5) 권한 OK
  // return <CapsuleDetailView capsule={capsule} mode="protected" />;
}
