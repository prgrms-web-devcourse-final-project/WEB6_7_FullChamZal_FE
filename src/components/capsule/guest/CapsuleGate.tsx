"use client";

import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LetterUnlockModal from "../detail/LetterUnlockModal";
import LetterDetailView from "../detail/LetterDetailView";

export default function CapsuleGate({ uuId }: { uuId: string }) {
  const [password, setPassword] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["readCapsulePassword", uuId],
    queryFn: ({ signal }) => guestCapsuleApi.checkPassword({ uuId }, signal),
  });

  if (isLoading) return <div className="p-8 text-text-3">불러오는 중...</div>;
  if (isError || !data)
    return <div className="p-8 text-text-3">정보를 불러오지 못했어요.</div>;

  const existedPassword = data.data.existedPassword;

  // 비밀번호 있는 캡슐이면: 비밀번호 입력 → 성공 시 상세로
  if (existedPassword && !password) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <LetterUnlockModal uuId={uuId} onSuccess={(pw) => setPassword(pw)} />
      </div>
    );
  }

  return <LetterDetailView uuId={uuId} password={password} />;
}
