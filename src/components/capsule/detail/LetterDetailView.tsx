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
    // 보호가 아니거나 이미 해제된 편지는 바로 보여주고 싶으면
    mode !== "public" || capsule.isUnlocked
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
