/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import LetterDetailModal from "./LetterDetailModal";
import LetterLockedView from "./LetterLockedView";
import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";

// 에러 응답(JSON)에서 unlockAt 뽑기 (apiFetch 구현에 따라 경로가 다를 수 있어서 방어적으로)
function extractUnlockAtFromError(err: unknown): string | null {
  const e: any = err;

  // 흔한 케이스들:
  // 1) e.data.data.unlockAt
  // 2) e.data.unlockAt
  // 3) e.response.data.data.unlockAt (axios 스타일)
  // 4) e.response.data.unlockAt
  // 5) e.cause?.data...
  const candidates = [
    e?.data?.data?.unlockAt,
    e?.data?.unlockAt,
    e?.response?.data?.data?.unlockAt,
    e?.response?.data?.unlockAt,
    e?.cause?.data?.data?.unlockAt,
    e?.cause?.data?.unlockAt,
  ];

  const v = candidates.find((x) => typeof x === "string" && x.length > 0);
  return v ?? null;
}

type Props = {
  capsuleId: number;
  password?: string | number | null;
};

export default function LetterDetailView({
  capsuleId,
  password = null,
}: Props) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["capsuleRead", capsuleId, password],
    queryFn: async ({ signal }) => {
      const unlockAt = new Date().toISOString();

      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation)
          reject(new Error("위치 정보를 사용할 수 없습니다."));
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10_000,
        });
      });

      return guestCapsuleApi.read(
        {
          capsuleId,
          unlockAt,
          locationLat: pos.coords.latitude ?? null,
          locationLng: pos.coords.longitude ?? null,
          password,
        },
        signal
      );
    },
    enabled: capsuleId > 0,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        불러오는 중...
      </div>
    );
  }

  // 조건 미충족으로 서버가 4xx를 주는 경우: 에러 바디에 unlockAt이 있으면 그걸 사용
  if (isError || !data) {
    const unlockAtFromServer = extractUnlockAtFromError(error);

    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        <LetterLockedView
          unlockAt={
            unlockAtFromServer ??
            new Date(Date.now() + 10 * 60 * 1000).toISOString()
          }
        />
      </div>
    );
  }

  const capsule = data.data;

  // read 성공(열람 가능)
  if (capsule.viewStatus) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        <LetterDetailModal
          capsuleId={capsuleId}
          role="USER"
          open={true}
          password={password}
        />
      </div>
    );
  }

  // read 응답은 받았는데 조건 미충족(열람 불가) → 응답의 unlockAt 사용 (정상)
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8">
      <LetterLockedView
        unlockAt={capsule.unlockAt ?? new Date().toISOString()}
      />
    </div>
  );
}
