/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LetterPasswordModal from "../detail/LetterPasswordModal";
import LetterDetailView from "../detail/LetterDetailView";
import { ApiEnvelope } from "@/lib/api/fetchClient";

export default function CapsuleGate({ uuId }: { uuId: string }) {
  const [password, setPassword] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["readCapsulePassword", uuId],
    queryFn: ({ signal }) =>
      guestCapsuleApi.checkPassword({ uuid: uuId }, signal),
  });

  if (isLoading) return <div className="p-8 text-text-3">불러오는 중...</div>;
  if (isError || !data)
    return <div className="p-8 text-text-3">정보를 불러오지 못했어요.</div>;

  const payload: ReadCapsulePasswordData | undefined =
    (data as any)?.data?.data ??
    (data as ApiEnvelope<ReadCapsulePasswordData>)?.data ??
    (data as unknown as ReadCapsulePasswordData);

  if (!payload?.capsuleId) {
    return <div className="p-8 text-text-3">응답 형식이 예상과 달라요.</div>;
  }

  const { capsuleId, existedPassword, isProtected } = payload;

  // 비밀번호가 존재하고 isProtected가 0인 캡슐이면: 비밀번호 입력 → 성공 시 상세로
  if (existedPassword && !isProtected && !password) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <LetterPasswordModal
          isProtected={isProtected}
          onSuccess={(pw) => setPassword(pw)}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <LetterDetailView
        capsuleId={capsuleId}
        isProtected={isProtected}
        password={password}
      />
    </div>
  );
}
