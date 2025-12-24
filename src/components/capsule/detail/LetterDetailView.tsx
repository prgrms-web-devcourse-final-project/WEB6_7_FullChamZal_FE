/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/purity */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LetterDetailModal from "./LetterDetailModal";
import LetterLockedView from "./LetterLockedView";
import { guestCapsuleApi } from "@/lib/api/capsule/guestCapsule";

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
  isPublic: boolean;
  capsuleId: number;
  isProtected?: number;
  password?: string | null;
};

export default function LetterDetailView({
  isPublic,
  capsuleId,
  isProtected,
  password = null,
}: Props) {
  // 내 위치 (current)
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // 최초 1회 내 위치 시도
  useEffect(() => {
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
  }, []);

  // 너무 자주 리패치 방지(좌표 라운딩)
  const locationKey = useMemo(() => {
    if (!currentLocation) return "no-location";
    const lat = Number(currentLocation.lat.toFixed(5));
    const lng = Number(currentLocation.lng.toFixed(5));
    return `${lat},${lng}`;
  }, [currentLocation]);

  const { data, isLoading, isError, error } = useQuery({
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

      console.log("/capsule/read payload:", {
        capsuleId,
        unlockAt,
        locationLat,
        locationLng,
      });
      console.log("/capsule/read response:", res);

      return res;
    },
    retry: false,
    enabled: capsuleId > 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        불러오는 중...
      </div>
    );
  }

  // 네트워크/서버 레벨 에러 (응답 자체가 없음)
  if (isError || !data) {
    const fallbackUnlockAt = new Date(
      Date.now() + 10 * 60 * 1000
    ).toISOString();
    console.log("❌ /capsule/read error:", error);

    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        <LetterLockedView isPublic={isPublic} unlockAt={fallbackUnlockAt} />
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
          viewingRadius={capsule.locationRadiusM}
          locationName={capsule.locationName}
          locationErrorMessage={locationError ?? undefined}
        />
      </div>
    );
  }

  // 열람 가능
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
