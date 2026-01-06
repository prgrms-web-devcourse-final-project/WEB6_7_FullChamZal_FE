"use client";

import ApiError from "@/components/common/error/ApiError";
import PendingLettersSkeleton from "@/components/ui/skeleton/dashboard/home/PendingLettersSkeleton";
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

/* UTC 파싱(판정용) */
function normalizeToUtcIso(s: string) {
  if (/[zZ]$|[+\-]\d{2}:\d{2}$/.test(s)) return s;
  const fixed = s.replace(" ", "T");
  return fixed + "Z";
}

function getUtcMs(isoString?: string | null) {
  if (!isoString) return null;
  const utcIso = normalizeToUtcIso(String(isoString));
  const ms = new Date(utcIso).getTime();
  return Number.isFinite(ms) ? ms : null;
}

/** 남은 시간 포맷 */
function formatRemaining(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);

  if (days > 0) return `${days}일 ${hours}시간`;
  if (hours > 0) return `${hours}시간 ${minutes}분`;
  return `${minutes}분`;
}

function getRemainingText(unlockAt?: string | null) {
  const target = getUtcMs(unlockAt);
  if (target == null) return null;

  const diff = target - Date.now();
  if (diff <= 0) return "지금 열 수 있어요";
  return `남은 시간 ${formatRemaining(diff)}`;
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
function getRightIcons(type: string): LucideIcon[] {
  const t = type as UnlockType;

  switch (t) {
    case "TIME":
      return [Clock];
    case "LOCATION":
      return [MapPin];
    case "TIME_AND_LOCATION":
      return [Clock, MapPin];
    default:
      return [];
  }
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
            const RightIcons = getRightIcons(l.unlockType ?? "");
            const conditionText = getUnlockConditionText(l);

            const isTime =
              l.unlockType === "TIME" || l.unlockType === "TIME_AND_LOCATION";
            const isLocation =
              l.unlockType === "LOCATION" ||
              l.unlockType === "TIME_AND_LOCATION";

            // 남은시간 (TIME, TIME_AND_LOCATION)
            const remainingText = isTime
              ? getRemainingText(l.unlockAt ?? null)
              : null;

            // 거리 (LOCATION, TIME_AND_LOCATION)
            let distanceText: string | null = null;
            if (isLocation) {
              if (
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
                distanceText = `남은 거리 ${formatDistance(km)}`;
              } else {
                distanceText = "거리 정보 없음";
              }
            }

            return (
              <DivBox
                key={l.capsuleId}
                className="cursor-auto snap-start min-w-[85%] sm:min-w-[70%] lg:min-w-0"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-text-3 text-xs">보낸 사람</span>
                      <span>{l.sender}</span>
                    </div>

                    <div className="flex gap-1.5">
                      {RightIcons.map((Icon, idx) => (
                        <Icon key={idx} size={18} />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-text-3 text-xs">해제 조건</span>
                    <span className="line-clamp-2">{conditionText}</span>
                  </div>

                  {/* TIME_AND_LOCATION이면 남은시간 + 거리 둘 다 표시 */}
                  <div className="flex gap-2 text-text-3">
                    {remainingText ? (
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span className="text-sm">{remainingText}</span>
                      </div>
                    ) : null}

                    {distanceText ? (
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span className="text-sm">{distanceText}</span>
                      </div>
                    ) : null}

                    {/* TIME인데 unlockAt이 없거나 파싱 실패하면 최소 표시 */}
                    {!remainingText && isTime ? (
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span className="text-sm">시간 정보 없음</span>
                      </div>
                    ) : null}
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
