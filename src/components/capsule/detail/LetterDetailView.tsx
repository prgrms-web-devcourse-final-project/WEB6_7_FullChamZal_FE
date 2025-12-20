/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/purity */
"use client";

import { useQuery } from "@tanstack/react-query";
import LetterDetailModal from "./LetterDetailModal";
import LetterLockedView from "./LetterLockedView";
import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";

type Props = {
  capsuleId: number;
  isProtected: number;
  password?: string | null;
};

export default function LetterDetailView({
  capsuleId,
  isProtected,
  password = null,
}: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["capsuleRead", capsuleId],
    queryFn: async ({ signal }) => {
      const unlockAt = new Date().toISOString();

      try {
        const res = await guestCapsuleApi.read(
          {
            capsuleId,
            unlockAt,
            locationLat: 0,
            locationLng: 0,
            password,
          },
          signal
        );

        console.log("✅ /capsule/read success payload:", res);
        return res;
      } catch (e: any) {
        throw new Error(e);
      }
    },
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
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        <LetterLockedView
          unlockAt={new Date(Date.now() + 10 * 60 * 1000).toISOString()}
        />
      </div>
    );
  }

  const capsule = data;

  // read 성공(열람 가능)
  if (capsule.viewStatus) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        <LetterDetailModal
          capsuleId={capsule.capsuleId}
          isProtected={isProtected}
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
