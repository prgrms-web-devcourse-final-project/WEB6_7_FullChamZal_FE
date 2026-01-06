"use client";

import { Lock, MapPin, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LatLng = { lat: number; lng: number };

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** unlockAt이 UTC로 파싱되도록 보정 (Z/offset 없으면 UTC로 간주하고 Z 붙임) */
function toUtcIso(s: string) {
  if (/[zZ]$|[+\-]\d{2}:\d{2}$/.test(s)) return s;
  return s.replace(" ", "T") + "Z";
}

function formatKstDateTime(ms: number) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

function formatRemaining(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

function TimeBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-outline px-4 py-3 rounded-2xl bg-sub text-center min-w-21.5">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-text-2">{label}</div>
    </div>
  );
}

function distanceMeter(a: LatLng, b: LatLng) {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  const c = 2 * Math.asin(Math.min(1, Math.sqrt(h)));
  return R * c;
}

function getLockMessage(args: {
  unlockType: "TIME" | "LOCATION" | "TIME_AND_LOCATION";
  isTimeUnlocked: boolean;
  isLocationUnlocked: boolean;
}) {
  const { unlockType, isTimeUnlocked, isLocationUnlocked } = args;

  if (unlockType === "TIME_AND_LOCATION") {
    if (!isTimeUnlocked && !isLocationUnlocked) {
      return {
        title: "아직 조건이 충족되지 않았습니다",
        desc: "지정된 날짜 이후 + 지정된 장소 도착 시 열 수 있어요.",
        status: ["시간: 대기 중", "장소: 이동 필요"],
      };
    }
    if (!isTimeUnlocked && isLocationUnlocked) {
      return {
        title: "아직 시간이 되지 않았습니다",
        desc: "장소 조건은 충족했어요. 시간이 되면 열 수 있어요.",
        status: ["시간: 대기 중", "장소: 확인 완료"],
      };
    }
    if (isTimeUnlocked && !isLocationUnlocked) {
      return {
        title: "지정된 장소에 도착해야 합니다",
        desc: "시간은 충족했어요. 장소에 도착하면 열 수 있어요.",
        status: ["시간: 충족됨", "장소: 이동 필요"],
      };
    }
    return {
      title: "모든 조건이 충족되었습니다",
      desc: "지금 바로 편지를 확인할 수 있어요.",
      status: [],
    };
  }

  if (unlockType === "TIME") {
    return {
      title: isTimeUnlocked
        ? "이제 열 수 있습니다!"
        : "아직 시간이 되지 않았습니다.",
      desc: isTimeUnlocked
        ? "지금 바로 편지를 확인할 수 있어요."
        : "정해진 날짜가 되면 편지를 열 수 있어요.",
      status: [],
    };
  }

  // LOCATION
  return {
    title: isLocationUnlocked
      ? "이제 열 수 있습니다!"
      : "지정된 장소에 도착해야 합니다",
    desc: isLocationUnlocked
      ? "지금 바로 편지를 확인할 수 있어요."
      : "해당 위치에 도착하면 편지를 열 수 있어요.",
    status: [],
  };
}

export default function LetterLockedView({
  isPublic,
  unlockAt,
  unlockUntil,
  unlockType = "TIME",
  currentLocation,
  targetLocation,
  viewingRadius = 50,
  locationName = "없음",
  locationErrorMessage,
}: {
  isPublic: boolean;
  unlockAt: string;
  unlockUntil: string;
  unlockType?: "TIME" | "LOCATION" | "TIME_AND_LOCATION";
  currentLocation?: LatLng;
  targetLocation?: LatLng;
  viewingRadius?: number;
  locationName?: string;
  locationErrorMessage?: string;
}) {
  const router = useRouter();

  // ---------------- TIME ----------------
  const unlockTime = useMemo(() => {
    const t = new Date(toUtcIso(unlockAt)).getTime();
    return Number.isFinite(t) ? t : NaN;
  }, [unlockAt]);

  const unlockUntilTime = useMemo(() => {
    if (!unlockUntil) return NaN;
    const t = new Date(toUtcIso(unlockUntil)).getTime();
    return Number.isFinite(t) ? t : NaN;
  }, [unlockUntil]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remainingMsRaw = unlockTime - now;

  const isTimeUnlocked = Number.isFinite(unlockTime)
    ? remainingMsRaw <= 0
    : false;

  const remainingMs = Number.isFinite(unlockTime)
    ? Math.max(0, remainingMsRaw)
    : 0;

  const expiredMs =
    Number.isFinite(unlockUntilTime) && now > unlockUntilTime
      ? now - unlockUntilTime
      : 0;

  const expired = formatRemaining(expiredMs);

  const t = formatRemaining(remainingMs);

  // ---------------- LOCATION ----------------
  const distance = useMemo(() => {
    if (!currentLocation || !targetLocation) return null;
    return distanceMeter(currentLocation, targetLocation);
  }, [currentLocation, targetLocation]);

  const isLocationUnlocked = useMemo(() => {
    if (unlockType === "TIME") return true;
    if (distance == null) return false;
    return distance <= viewingRadius;
  }, [unlockType, distance, viewingRadius]);

  const msg = useMemo(
    () =>
      getLockMessage({
        unlockType,
        isTimeUnlocked,
        isLocationUnlocked,
      }),
    [unlockType, isTimeUnlocked, isLocationUnlocked]
  );

  const showTime = unlockType === "TIME" || unlockType === "TIME_AND_LOCATION";
  const showLocation =
    unlockType === "LOCATION" || unlockType === "TIME_AND_LOCATION";

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-120 px-4 shadow-2xl p-10 rounded-3xl border border-outline">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="p-5 rounded-full bg-sub">
            <Lock size={40} />
          </div>

          <div className="text-center space-y-2">
            <p className="text-xl font-semibold">{msg.title}</p>
            <p className="text-text-2 whitespace-pre-line">{msg.desc}</p>

            {locationErrorMessage ? (
              <p className="mt-2 text-xs text-error">{locationErrorMessage}</p>
            ) : null}

            {!Number.isFinite(unlockTime) ? (
              <p className="mt-2 text-xs text-error">
                unlockAt 값이 올바르지 않습니다.
              </p>
            ) : null}
          </div>

          {/* ---------- TIME UI ---------- */}
          {showTime ? (
            <div className="w-full flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-text-2">
                <Clock size={16} />
                <p className="text-sm">
                  오픈 날짜:{" "}
                  {Number.isFinite(unlockTime)
                    ? formatKstDateTime(unlockTime)
                    : "-"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {t.days > 0 && <TimeBox label="days" value={t.days} />}
                <TimeBox label="hours" value={pad2(t.hours)} />
                <TimeBox label="min" value={pad2(t.minutes)} />
                <TimeBox label="sec" value={pad2(t.seconds)} />
              </div>
            </div>
          ) : null}

          {/* ---------- UNLOCK UNTIL UI ---------- */}
          {unlockUntil &&
          Number.isFinite(unlockUntilTime) &&
          now > unlockUntilTime ? (
            <div className="w-full flex flex-col items-center gap-3 mt-2">
              <p className="text-sm text-error font-medium">
                열람 가능 시간이 종료되었습니다
              </p>

              <p className="text-xs text-text-3">
                종료 시각: {formatKstDateTime(unlockUntilTime)}
              </p>

              <div className="flex items-center gap-2">
                {expired.days > 0 && (
                  <TimeBox label="days ago" value={expired.days} />
                )}
                <TimeBox label="hours ago" value={pad2(expired.hours)} />
                <TimeBox label="min ago" value={pad2(expired.minutes)} />
                <TimeBox label="sec ago" value={pad2(expired.seconds)} />
              </div>
            </div>
          ) : null}

          {/* ---------- LOCATION UI ---------- */}
          {showLocation ? (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-text-2">
                <MapPin size={16} />
                <p className="text-sm">지정된 장소에 도착해야 열 수 있어요</p>
              </div>

              <div className="border border-outline px-6 py-4 rounded-2xl bg-sub text-center space-y-3">
                <div className="text-xs text-text-3 flex flex-col items-center gap-1">
                  <p>장소 이름: {locationName}</p>
                </div>

                {distance == null ? (
                  <p className="text-xs text-text-3">
                    현재 위치를 확인할 수 없어서 거리를 계산하지 못했어요.
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-sm font-medium">
                      남은 거리:{" "}
                      {distance >= 1000
                        ? `${(distance / 1000).toFixed(2)} km`
                        : `${Math.round(distance)} m`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <div className="text-center">
            {msg.status.length > 0 ? (
              <ul className="space-y-1 text-xs text-text-2">
                {msg.status.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : null}
          </div>

          {isPublic ? (
            <div className="flex gap-3 mt-4">
              <button
                className="cursor-pointer px-4 py-2 rounded-xl bg-sub"
                onClick={() => router.back()}
                type="button"
              >
                뒤로가기
              </button>
            </div>
          ) : (
            <div className="flex gap-3 mt-4">
              <button
                className="cursor-pointer px-4 py-2 rounded-xl bg-sub"
                onClick={() => router.push("/")}
                type="button"
              >
                홈으로 이동
              </button>
              <button
                className="cursor-pointer px-4 py-2 rounded-xl bg-primary-3 text-white hover:bg-primary-2"
                onClick={() => router.push("/auth/login")}
                type="button"
              >
                대시보드로 이동
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
