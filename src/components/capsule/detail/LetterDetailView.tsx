/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LetterDetailModal, { type UICapsule } from "./LetterDetailModal";
import LetterLockedView from "./LetterLockedView";
import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";
import { useRouter } from "next/navigation";

type LatLng = { lat: number; lng: number };

function isLatLng(v: any): v is LatLng {
  return (
    v != null &&
    typeof v.lat === "number" &&
    Number.isFinite(v.lat) &&
    typeof v.lng === "number" &&
    Number.isFinite(v.lng)
  );
}

function getCurrentPosition(): Promise<LatLng> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (p) =>
        resolve({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  });
}

type Props = {
  isPublic?: boolean;
  capsuleId: number;
  isProtected?: number;
  password?: string | null;
  initialLocation?: LatLng | null;
};

export default function LetterDetailView({
  isPublic = false,
  capsuleId,
  isProtected,
  password = null,
  initialLocation = null,
}: Props) {
  const router = useRouter();
  // 내 위치 (current)
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(
    initialLocation
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  // initialLocation이 없을 때만 위치 정보 가져오기
  useEffect(() => {
    // initialLocation이 이미 있으면 스킵
    if (initialLocation) {
      setCurrentLocation(initialLocation);
      return;
    }

    let mounted = true;

    getCurrentPosition()
      .then((pos) => {
        if (!mounted) return;
        setCurrentLocation(pos);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setLocationError(
          e?.message || "위치 정보를 가져오지 못했어요. (권한/설정 확인)"
        );
        setCurrentLocation(null);
      });

    return () => {
      mounted = false;
    };
  }, [initialLocation]);

  // 너무 자주 리패치 방지(좌표 라운딩)
  const locationKey = useMemo(() => {
    if (!currentLocation) return "no-location";
    const lat = Number(currentLocation.lat.toFixed(5));
    const lng = Number(currentLocation.lng.toFixed(5));
    return `${lat},${lng}`;
  }, [currentLocation]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["capsuleRead", capsuleId, password, locationKey],
    queryFn: async ({ signal }) => {
      const unlockAt = new Date().toISOString();

      const locationLat = currentLocation?.lat ?? 0;
      const locationLng = currentLocation?.lng ?? 0;

      const res = await guestCapsuleApi.read(
        {
          capsuleId,
          unlockAt,
          locationLat,
          locationLng,
          password,
        },
        signal
      );

      return res;
    },
    retry: false,
    // 공개 캡슐의 경우 위치 정보가 준비될 때까지 대기
    // initialLocation이 있으면 즉시 실행, 없으면 currentLocation이 설정될 때까지 대기
    enabled:
      capsuleId > 0 && (initialLocation !== null || currentLocation !== null),
  });

  const handleBack = () => {
    // 히스토리 없는 진입(공유 링크 첫 방문) 대비
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/dashboard", { scroll: false });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        불러오는 중...
      </div>
    );
  }

  // 네트워크/서버 레벨 에러 (응답 자체가 없음)
  if (isError || !data) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md rounded-2xl border border-outline bg-white p-6 text-center space-y-4">
          <div className="text-lg font-medium">서버 오류가 발생했어요</div>
          <p className="text-sm text-text-2">
            잠시 후 다시 시도해 주세요.
            <br />
            문제가 계속되면 네트워크 상태를 확인해 주세요.
          </p>

          <div className="flex gap-2 justify-center pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer px-4 py-2 rounded-lg border border-outline text-text hover:bg-button-hover"
            >
              뒤로 가기
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  const capsule = data;

  // 조건 미충족 (서버가 FAIL을 정상 응답으로 내려줌)
  if (capsule.result === "FAIL") {
    const maybeTarget = { lat: capsule.locationLat, lng: capsule.locationLng };
    const targetLocation = isLatLng(maybeTarget) ? maybeTarget : undefined;

    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        <LetterLockedView
          isPublic={isPublic}
          unlockAt={capsule.unlockAt ?? new Date().toISOString()}
          unlockType={capsule.unlockType}
          currentLocation={currentLocation ?? undefined}
          targetLocation={targetLocation}
          locationName={capsule.locationName}
          locationErrorMessage={locationError ?? undefined}
        />
      </div>
    );
  }

  // 열람 가능
  // LetterDetailView에서 이미 데이터를 가져왔으므로, LetterDetailModal에 전달하여 중복 요청 방지
  const modalData: UICapsule = {
    capsuleColor: capsule.capsuleColor ?? null,
    title: capsule.title,
    content: capsule.content,
    createdAt: capsule.createdAt,
    writerNickname: capsule.senderNickname,
    recipient: capsule.recipient ?? null,
    unlockType: capsule.unlockType,
    unlockAt: capsule.unlockAt,
    unlockUntil: capsule.unlockUntil,
    locationName: capsule.locationName ?? null,
    viewStatus: !!capsule.viewStatus,
    isBookmarked: !!capsule.isBookmarked,
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8">
      <LetterDetailModal
        capsuleId={capsule.capsuleId}
        isProtected={isProtected}
        role="USER"
        open={true}
        password={password}
        initialData={modalData}
      />
    </div>
  );
}
