"use client";

import ApiError from "@/components/common/error/ApiError";
import PendingLettersSkeleton from "@/components/skeleton/dashboard/home/PendingLettersSkeleton";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import { formatDateTime } from "@/lib/hooks/formatDateTime";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Sparkles, type LucideIcon } from "lucide-react";
import DivBox from "../../../DivBox";
import { useEffect, useMemo, useState } from "react";

// 거리 계산 (Haversine)
function calcDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 거리 표시 포맷
function formatDistance(km: number) {
  if (!Number.isFinite(km)) return "-";
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

// 해제 조건 텍스트
function getUnlockConditionText(l: CapsuleDashboardItem) {
  const type = l.unlockType as UnlockType;
  const timeText = l.unlockAt ? formatDateTime(l.unlockAt) : null;
  const locText = l.locationName ?? "지정 위치";

  switch (type) {
    case "TIME":
      return timeText ?? "-";
    case "LOCATION":
      return locText;
    case "TIME_AND_LOCATION":
      return `${locText}${timeText ? ` · ${timeText}` : ""}`;
    default:
      return timeText ?? locText ?? "-";
  }
}

// 오른쪽 상단 아이콘
function getRightIcon(type: string): LucideIcon {
  const t = type as UnlockType;
  if (t === "LOCATION") return MapPin;
  if (t === "TIME_AND_LOCATION") return Sparkles;
  return Clock;
}

export default function PendingLetters() {
  /* 현재 위치 */
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!navigator?.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setMyLocation(null);
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  const query = useQuery<PageResponse<CapsuleDashboardItem>>({
    queryKey: ["capsuleDashboard", "receive"],
    queryFn: ({ signal }) =>
      capsuleDashboardApi.receiveDashboard(undefined, signal),
    staleTime: 30_000,
    retry: 1,
  });

  const { data, isLoading, isError } = query;

  const unViewLetters = useMemo(() => {
    const list = data?.data.content ?? [];
    return list.filter((l) => !l.viewStatus);
  }, [data]);

  if (isLoading) return <PendingLettersSkeleton />;

  if (isError) {
    return (
      <ApiError
        title="미열람 편지를 불러오지 못했어요."
        description="네트워크 상태를 확인하고 다시 시도해주세요."
        onRetry={() => query.refetch()}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <Sparkles className="text-primary" />
        <div>
          <p className="text-lg">미열람 편지</p>
          <p className="text-sm text-text-3">
            아직 열지 않은 편지가{" "}
            <span className="text-primary font-semibold">
              {unViewLetters.length}통
            </span>{" "}
            있습니다.
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-4 lg:ml-6">
        {!unViewLetters.length ? (
          <div className="h-20 flex flex-col justify-center">
            <p className="text-text-4">미열람 편지가 없습니다.</p>
          </div>
        ) : (
          unViewLetters.slice(0, 4).map((l) => {
            const RightIcon = getRightIcon(l.unlockType ?? "");
            const conditionText = getUnlockConditionText(l);

            let subText = "-";
            let SubIcon: LucideIcon = Clock;

            // unlockType별 기본값
            if (l.unlockType === "LOCATION") {
              SubIcon = MapPin;
              subText = "거리 정보 없음";
            } else if (
              (l.unlockType === "TIME" ||
                l.unlockType === "TIME_AND_LOCATION") &&
              l.unlockAt
            ) {
              SubIcon = Clock;
              subText = formatDateTime(l.unlockAt);
            }

            // LOCATION + 위치정보 있으면 거리로 업데이트
            if (
              l.unlockType === "LOCATION" &&
              myLocation &&
              l.locationLat != null &&
              l.locationLng != null
            ) {
              const km = calcDistanceKm(
                myLocation.lat,
                myLocation.lng,
                l.locationLat,
                l.locationLng
              );
              subText = formatDistance(km);
            }

            return (
              <DivBox
                key={l.capsuleId}
                className="cursor-auto snap-start min-w-[85%] sm:min-w-[70%] lg:min-w-0"
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-text-3 text-xs">보낸 사람</span>
                      <span>{l.sender}</span>
                    </div>
                    <RightIcon size={18} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-text-3 text-xs">해제 조건</span>
                    <span className="line-clamp-2">{conditionText}</span>
                  </div>

                  <div className="flex items-center gap-2 text-text-3">
                    <SubIcon size={16} />
                    <span className="text-sm">{subText}</span>
                  </div>
                </div>
              </DivBox>
            );
          })
        )}
      </div>
    </div>
  );
}
