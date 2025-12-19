/* eslint-disable react-hooks/purity */
// app/capsule/[capsuleId]/page.tsx
import LetterDetailView from "@/components/capsule/detail/LetterDetailView";
import LetterLockedView from "@/components/capsule/detail/LetterLockedView";
import { authApiServer } from "@/lib/api/auth/auth.server";

import { redirect, notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ capsuleId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { capsuleId } = await params;
  console.log(capsuleId);

  // 1) 편지 조회
  // 편지 없으면 x
  // const letter = await getCapsuleById(capsuleId);
  // if (!capsule) notFound();

  // 2) 비밀번호가 있는 상태면 비밀번호 창 보여주기
  // if (!capsule.isProtected) {
  // return <LetterDetailView capsule={capsule} mode="public" />;
  // }

  // 3) isProtected === 1이면 해당 게시글을 볼 수 있는 회원인지 확인하기
  const me = await authApiServer.me();
  // 로그인이 되어있지 않으면
  if (!me) {
    // 로그인 후 다시 돌아오게 해서
    redirect(
      `/login?callbackUrl=/dashboard/capsules/${encodeURIComponent(capsuleId)}`
    );
  }
  // 로그인이 되어 있거나 로그인을 하게 해서 로그인 후에 다시 돌이왔을 때, 수신자 검증하기
  /* const isRecipient = capsule.toUserId === me.id;
  // 권한이 없는 경우
  if (!isRecipient) {
    return <CapsuleForbidden />;
  } */

  // 5) 권한 OK
  // return <LetterDetailModal capsule={capsule} mode="protected" />;

  return (
    <LetterLockedView
      unlockAt={new Date(Date.now() + 2000 * 60 * 1000).toISOString()}
    />
  );
}
