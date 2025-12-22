"use client";

import { Lock, MapPin, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LatLng = { lat: number; lng: number };

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatRemaining(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

function calcDDay(unlockAtMs: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(unlockAtMs);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "D-Day";
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)}`;
}

function TimeBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-outline px-4 py-3 rounded-2xl bg-sub text-center min-w-[86px]">
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
      desc: "정해진 날짜가 되면 편지를 열 수 있어요.",
      status: [],
    };
  }

  return {
    title: isLocationUnlocked
      ? "이제 열 수 있습니다!"
      : "지정된 장소에 도착해야 합니다",
    desc: "해당 위치에 도착하면 편지를 열 수 있어요.",
    status: [],
  };
}

export default function LetterLockedView({
  unlockAt,
  unlockType = "TIME",
  currentLocation,
  targetLocation,
  allowedRadiusMeter = 100,
  locationErrorMessage,
}: {
  unlockAt: string;
  unlockType?: "TIME" | "LOCATION" | "TIME_AND_LOCATION";
  currentLocation?: LatLng;
  targetLocation?: LatLng;
  allowedRadiusMeter?: number;
  locationErrorMessage?: string;
}) {
  const router = useRouter();

  // ---------------- TIME ----------------
  const unlockTime = useMemo(() => new Date(unlockAt).getTime(), [unlockAt]);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remainingMs = unlockTime - now;
  const isTimeUnlocked = remainingMs <= 0;

  const t = formatRemaining(remainingMs);
  const dDay = calcDDay(unlockTime);

  // ---------------- LOCATION ----------------
  const distance = useMemo(() => {
    if (!currentLocation || !targetLocation) return null;
    return distanceMeter(currentLocation, targetLocation);
  }, [currentLocation, targetLocation]);

  const isLocationUnlocked =
    distance != null &&
    Number.isFinite(distance) &&
    distance <= allowedRadiusMeter;

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
      <div className="w-full max-w-120 px-4 shadow-2xl p-10 rounded-3xl">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="p-5 rounded-full bg-sub">
            <Lock size={40} />
          </div>

          <div className="text-center space-y-2">
            <p className="text-xl font-semibold">{msg.title}</p>
            <p className="text-text-2 whitespace-pre-line">{msg.desc}</p>

            {msg.status.length > 0 ? (
              <ul className="mt-2 space-y-1 text-xs text-text-2">
                {msg.status.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : null}

            {locationErrorMessage ? (
              <p className="mt-2 text-xs text-red-500">
                {locationErrorMessage}
              </p>
            ) : null}
          </div>

          {/* ---------- TIME UI ---------- */}
          {showTime ? (
            <div className="w-full flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-text-2">
                <Clock size={16} />
                <p className="text-sm">
                  오픈 날짜: {new Date(unlockTime).toLocaleDateString()}
                </p>
              </div>

              <p className="text-lg font-semibold">{dDay}</p>

              <div className="flex items-center gap-2">
                {t.days > 0 && <TimeBox label="days" value={t.days} />}
                <TimeBox label="hours" value={pad2(t.hours)} />
                <TimeBox label="min" value={pad2(t.minutes)} />
                <TimeBox label="sec" value={pad2(t.seconds)} />
              </div>

              <p className="text-xs text-text-2">
                오픈 시각: {new Date(unlockTime).toLocaleString()}
              </p>
            </div>
          ) : null}

          {/* ---------- LOCATION UI ---------- */}
          {showLocation ? (
            <div className="w-full flex flex-col items-center gap-2 mt-2">
              <div className="flex items-center gap-2 text-text-2">
                <MapPin size={16} />
                <p className="text-sm">지정된 장소에 도착해야 열 수 있어요</p>
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
                  <p className="text-xs text-text-3">
                    허용 반경: {allowedRadiusMeter}m 이내
                  </p>
                </div>
              )}
            </div>
          ) : null}

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
              로그인하고 저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
