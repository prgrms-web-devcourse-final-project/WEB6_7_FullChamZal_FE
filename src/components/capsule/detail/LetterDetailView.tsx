"use client";

import { useState } from "react";
import LetterDetailModal from "./LetterDetailModal";
import LetterUnlockModal from "./LetterUnlockModal";

export default function LetterDetailView({
  capsule,
  mode,
}: {
  capsule: Capsule;
  mode: "public" | "protected";
}) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(
    // 비밀번호가 있는 편지
    mode !== "public"
  );

  // (더미) 비밀번호 검증 함수 — 나중에 API로 교체
  const verifyPassword = async (password: string) => {
    // 예: capsule.passwordHash가 있다면 서버에서 검증해야 함
    // 지금은 더미로 "1234"만 통과
    return password === "1234";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8">
      {isUnlocked ? (
        <LetterDetailModal capsuleId={capsule.id} mode={mode} />
      ) : (
        <LetterUnlockModal
          onSuccess={() => setIsUnlocked(true)}
          onVerify={verifyPassword}
        />
      )}
    </div>
  );
}
