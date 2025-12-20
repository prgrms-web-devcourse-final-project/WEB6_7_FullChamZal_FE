/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Logo from "@/components/common/Logo";
import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";
import LetterLockedView from "./LetterLockedView";
import { redirect } from "next/navigation";
import ForbiddenPage from "./ForbiddenPage";

export default function LetterUnlockModal({
  capsuleId,
  isProtected,
  onSuccess,
}: {
  capsuleId: number;
  isProtected: number;
  onSuccess: (password: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const unlockAt = new Date().toISOString();

      const pos = await new Promise<{ lat: number; lng: number }>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("위치 정보를 사용할 수 없습니다."));
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
            (err) => reject(err),
            {
              enableHighAccuracy: false, // 핵심
              timeout: 20_000, // 10초 → 20초
              maximumAge: 60_000, // 최근 위치 캐시 허용(1분)
            }
          );
        }
      );

      // 실제 read API 호출
      const result = await guestCapsuleApi.read({
        capsuleId,
        unlockAt,
        locationLat: pos.lat ?? null,
        locationLng: pos.lng ?? null,
        password,
      });

      // 여기서 응답 구조 확인
      console.log("📦 read capsule result:", result);

      onSuccess(password);
    } catch (err: any) {
      console.error("❌ read capsule error:", err);
      setError(
        err?.message || "비밀번호가 올바르지 않거나 조건이 충족되지 않았어요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (error === "이 캡슐의 수신자가 아닙니다.") return <ForbiddenPage />;

  /* if (error === "시간/위치 검증에 실패하였습니다.")
    return <LetterLockedView unlockAt={} />; */

  return (
    <section className="w-full max-w-120 rounded-3xl border border-outline bg-white shadow-xl p-10">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-primary">
          <Logo className="w-9" />
          <span className="text-2xl font-paperozi font-extrabold">
            Dear. ___
          </span>
        </div>

        <form onSubmit={submit} className="w-full space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="w-full rounded-lg border border-outline px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <Button
            type="submit"
            className="w-full py-2 text-sm font-normal"
            disabled={isLoading || password.length === 0}
          >
            {isLoading ? "확인 중..." : "편지 열람"}
          </Button>
        </form>
      </div>
    </section>
  );
}
