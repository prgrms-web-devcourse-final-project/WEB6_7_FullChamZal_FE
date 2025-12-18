"use client";

import { Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* =========================
   공용 유틸
========================= */

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

// 오늘 00:00 기준 D-day 계산
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

/* =====================================================
   TIME / LOCATION / TIME_AND_LOCATION UX 문구 설계 (주석용)

   - 지금은 "TIME만" 쓰고 있지만,
   - 나중에 unlockType + 위치 조건(isLocationUnlocked) 연결하면
     아래 로직을 그대로 적용할 수 있음.

   사용 예 (주석 해제해서 적용):
   const lockMessage = getLockMessage({ unlockType, isTimeUnlocked, isLocationUnlocked })
   title/desc/status를 UI에 뿌리기
===================================================== */

/*
function getLockMessage({
  unlockType,
  isTimeUnlocked,
  isLocationUnlocked,
}: {
  unlockType: "TIME" | "LOCATION" | "TIME_AND_LOCATION";
  isTimeUnlocked: boolean;
  isLocationUnlocked: boolean;
}) {
  // TIME + LOCATION 모두 필요한 경우
  if (unlockType === "TIME_AND_LOCATION") {
    // 1) 시간 ❌ / 장소 ❌
    if (!isTimeUnlocked && !isLocationUnlocked) {
      return {
        title: "아직 조건이 충족되지 않았습니다",
        desc:
          "이 편지는 지정된 날짜 이후,\n지정된 장소에 도착했을 때 열 수 있어요.",
        status: ["시간: 대기 중", "장소: 이동 필요"],
      };
    }

    // 2) 시간 ❌ / 장소 ✅
    if (!isTimeUnlocked && isLocationUnlocked) {
      return {
        title: "아직 시간이 되지 않았습니다",
        desc:
          "이미 지정된 장소에 도착했어요.\n정해진 시간이 되면 자동으로 열 수 있습니다.",
        status: ["시간: 대기 중", "장소: 확인 완료"],
      };
    }

    // 3) 시간 ✅ / 장소 ❌
    if (isTimeUnlocked && !isLocationUnlocked) {
      return {
        title: "지정된 장소에 도착해야 합니다",
        desc:
          "정해진 시간이 지났어요.\n지정된 장소에 도착하면 편지를 열 수 있어요.",
        status: ["시간: 충족됨", "장소: 이동 필요"],
      };
    }

    // 4) 시간 ✅ / 장소 ✅
    return {
      title: "모든 조건이 충족되었습니다",
      desc: "지금 바로 편지를 확인할 수 있어요.",
      status: [],
    };
  }

  // TIME 단독 조건
  if (unlockType === "TIME") {
    return {
      title: isTimeUnlocked
        ? "이제 열 수 있습니다!"
        : "아직 시간이 되지 않았습니다",
      desc: "정해진 날짜가 되면 편지를 열 수 있어요.",
      status: [],
    };
  }

  // LOCATION 단독 조건
  return {
    title: isLocationUnlocked
      ? "이제 열 수 있습니다!"
      : "지정된 장소에 도착해야 합니다",
    desc: "해당 위치에 도착하면 편지를 열 수 있어요.",
    status: [],
  };
}
*/

export default function LetterLockedView({
  unlockAt,
}: // 장소 기반 조건 확장용 (현재 미사용)
// unlockType, // "TIME" | "LOCATION" | "TIME_AND_LOCATION"
// targetLocation, // { lat: number; lng: number; name?: string }
// allowedRadiusMeter = 100,
{
  unlockAt: string;

  // unlockType?: "TIME" | "LOCATION" | "TIME_AND_LOCATION";
  // targetLocation?: {
  //   lat: number;
  //   lng: number;
  //   name?: string;
  // };
  // allowedRadiusMeter?: number;
}) {
  const router = useRouter();

  /* =========================
     TIME 기반 상태
  ========================= */

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

  /* =========================
     LOCATION 기반 상태
  ========================= */

  // const [hasLocationPermission, setHasLocationPermission] =
  //   useState<boolean | null>(null);
  // const [distanceMeter, setDistanceMeter] = useState<number | null>(null);

  /*
    LOCATION unlock 흐름(예정):
    1) navigator.geolocation.getCurrentPosition
    2) 현재 위치 ↔ 목표 위치 거리 계산
    3) distanceMeter <= allowedRadiusMeter 이면 unlock

    unlockType 별 조건(예정):
    - TIME: isTimeUnlocked
    - LOCATION: isLocationUnlocked
    - TIME_AND_LOCATION: isTimeUnlocked && isLocationUnlocked
  */

  // const isLocationUnlocked =
  //   hasLocationPermission === true &&
  //   distanceMeter !== null &&
  //   distanceMeter <= allowedRadiusMeter;

  /*
    TIME_AND_LOCATION 문구 적용(예정):
    const lockMessage = getLockMessage({
      unlockType,
      isTimeUnlocked,
      isLocationUnlocked,
    });

    <p className="text-xl">{lockMessage.title}</p>
    <p className="text-text-2 whitespace-pre-line">{lockMessage.desc}</p>
    {lockMessage.status.map(...) ...}
  */

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-120 px-4 shadow-2xl p-10 rounded-3xl">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="p-5 rounded-full bg-sub">
            <Lock size={40} />
          </div>

          <div className="text-center space-y-2">
            <p className="text-xl">
              {isTimeUnlocked
                ? "이제 열 수 있습니다!"
                : "아직 시간이 되지 않았습니다."}
            </p>
            <p className="text-text-2">
              조건이 다 되어야 편지를 확인할 수 있어요.
              <br />
              편지를 저장(보관)하려면 로그인이 필요합니다.
            </p>

            {/* =========================
                TIME_AND_LOCATION UX 문구(주석)
                - 아래처럼 status까지 보여주면 유저가 "뭐가 안됐는지" 즉시 이해함
               ========================= */}
            {/*
              <p className="text-xl">{lockMessage.title}</p>
              <p className="text-text-2 whitespace-pre-line">{lockMessage.desc}</p>
              {lockMessage.status.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-text-2">
                  {lockMessage.status.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            */}
          </div>

          {/* 날짜 + D-day + 타이머 */}
          <div className="w-full flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm text-text-2">
                오픈 날짜: {new Date(unlockTime).toLocaleDateString()}
              </p>
              <p className="text-lg font-semibold">{dDay}</p>
            </div>

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

          {/* =========================
              장소 기반 UI (주석)
             ========================= */}
          {/*
            unlockType === "LOCATION" ||
            unlockType === "TIME_AND_LOCATION" ? (
              <div className="w-full flex flex-col items-center gap-2">
                <p className="text-sm text-text-2">
                  지정된 장소에 도착해야 편지를 열 수 있어요
                </p>

                <p className="text-xs">
                  목표 위치: {targetLocation?.name ?? "지정 위치"}
                </p>

                {hasLocationPermission === false && (
                  <p className="text-xs text-red-500">
                    위치 권한을 허용해주세요
                  </p>
                )}

                {distanceMeter !== null && (
                  <p className="text-xs text-text-2">
                    현재 거리: {Math.round(distanceMeter)}m
                  </p>
                )}
              </div>
            ) : null
          */}

          <div className="flex gap-3">
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

          {/* =========================
              UX 설계 의도(주석)
              - TIME_AND_LOCATION은 "뭐가 안됐는지"를 분리해서 보여주는 게 핵심
                1) 시간 ❌ / 장소 ❌  : 둘 다 필요
                2) 시간 ❌ / 장소 ✅  : 시간만 기다리기
                3) 시간 ✅ / 장소 ❌  : 장소로 이동하기
                4) 시간 ✅ / 장소 ✅  : 열기 가능(이 화면 숨기는 게 베스트)
             ========================= */}
        </div>
      </div>
    </div>
  );
}
