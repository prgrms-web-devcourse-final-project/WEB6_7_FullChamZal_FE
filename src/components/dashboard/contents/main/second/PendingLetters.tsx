/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Clock, MapPin, Sparkle } from "lucide-react";
import DivBox from "../../../DivBox";
import { useQuery } from "@tanstack/react-query";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import { useEffect, useMemo, useState } from "react";

// 날짜 포맷
function formatKoreanDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// D-Day 계산
function formatDDay(iso: string) {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "-";

  const diff = Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return `D+${Math.abs(diff)}`;
}

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
  const timeText = l.unlockAt ? formatKoreanDateTime(l.unlockAt) : null;
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
function getRightIcon(type: string) {
  const t = type as UnlockType;
  if (t === "LOCATION") return MapPin;
  if (t === "TIME_AND_LOCATION") return Sparkle;
  return Clock;
}

export default function PendingLetters() {
  const { data, isLoading, isError } = useQuery<unknown>({
    queryKey: ["capsuleDashboard", "receive"],
    queryFn: ({ signal }) => capsuleDashboardApi.receiveDashboard(signal),
    staleTime: 30_000,
    retry: 1,
  });

  const receiveList: CapsuleDashboardItem[] = Array.isArray(data)
    ? (data as CapsuleDashboardItem[])
    : [];

  /* 현재 위치 */
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    // 브라우저 환경 가드 (안전)
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

  /* 미열람 편지 */
  const unViewLetters = useMemo(
    () => receiveList.filter((l: CapsuleDashboardItem) => !l.viewStatus),
    [receiveList]
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <Sparkle className="text-primary" />
        <div>
          <p className="text-lg">미열람 편지</p>

          {isLoading ? (
            <p className="text-sm text-text-3">불러오는 중…</p>
          ) : isError ? (
            <p className="text-sm text-text-3">편지를 불러오지 못했어요.</p>
          ) : (
            <p className="text-sm text-text-3">
              아직 열리지 않은 편지가{" "}
              <span className="text-primary font-semibold">
                {unViewLetters.length}통
              </span>{" "}
              있습니다.
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 lg:ml-6">
        {isLoading ? (
          <div className="h-20 flex flex-col justify-center">
            <p className="text-text-4">불러오는 중…</p>
          </div>
        ) : !unViewLetters.length ? (
          <div className="h-20 flex flex-col justify-center">
            <p className="text-text-4">미열람 편지가 없습니다.</p>
          </div>
        ) : (
          unViewLetters.slice(0, 4).map((l) => {
            const RightIcon = getRightIcon(l.unlockType ?? "");
            const conditionText = getUnlockConditionText(l);

            let subText = "-";
            let SubIcon = Clock;

            // TIME / TIME_AND_LOCATION → D-Day
            if (
              (l.unlockType === "TIME" ||
                l.unlockType === "TIME_AND_LOCATION") &&
              l.unlockAt
            ) {
              subText = formatDDay(l.unlockAt);
              SubIcon = Clock;
            }

            // LOCATION → 거리
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
              SubIcon = MapPin;
            }

            return (
              <DivBox key={l.capsuleId}>
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
