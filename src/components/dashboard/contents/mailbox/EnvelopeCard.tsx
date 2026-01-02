/* eslint-disable react-hooks/static-components */
"use client";

import { useEffect, useMemo, useRef, useState } from "react"; // ✅ useEffect, useRef 추가
import { formatDateTime } from "@/lib/hooks/formatDateTime";
import Logo from "@/components/common/Logo";
import { Clock, Lock, MapPin, Unlock, Pencil, PencilOff } from "lucide-react";
import { CAPTURE_COLOR_MAP } from "@/constants/capsulePalette";
import { useRouter } from "next/navigation";

type LatLng = { lat: number; lng: number };

type Props = {
  capsule: CapsuleDashboardItem;
  type: "send" | "receive" | "bookmark";
  currentPos?: LatLng | null;
};

/* 위치 계산 */
function distanceMeters(a: LatLng, b: LatLng) {
  const R = 6371e3;
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

/* 타입 별 UI */
function getEnvelopeStatus(
  capsule: CapsuleDashboardItem,
  type: Props["type"],
  currentPos?: LatLng | null
) {
  const isRead = !!capsule.viewStatus;

  // send: 잠금 조건 대신 열람/수정 상태만
  if (type === "send") {
    const canEdit = !isRead;
    const statusText = isRead ? "상대가 읽음" : "아직 안 읽음";
    const editText = canEdit ? "수정 가능" : "수정 불가";

    return {
      mode: "send" as const,
      isRead,
      canEdit,
      statusText,
      editText,
    };
  }

  const unlockType = (capsule.unlockType ?? "").toUpperCase();
  const needsTime = unlockType === "TIME" || unlockType === "TIME_AND_LOCATION";
  const needsLocation =
    unlockType === "LOCATION" || unlockType === "TIME_AND_LOCATION";

  // --- 시간 조건 ---
  const timeLabel = capsule.unlockAt
    ? formatDateTime(capsule.unlockAt)
    : "시간 조건 없음";

  const isUnlockedByTime =
    needsTime && capsule.unlockAt
      ? Date.now() >= new Date(capsule.unlockAt).getTime()
      : !needsTime;

  // --- 위치 조건 ---
  const targetLat = capsule.locationLat;
  const targetLng = capsule.locationLng;

  const radiusM = 50;

  const hasTarget =
    typeof targetLat === "number" && typeof targetLng === "number";
  const canCheckLocation = !!currentPos && hasTarget;

  const isUnlockedByLocation = needsLocation
    ? canCheckLocation
      ? distanceMeters(currentPos!, { lat: targetLat!, lng: targetLng! }) <=
        radiusM
      : false
    : true;

  // 표시 라벨
  const conditionLabel =
    needsTime && needsLocation
      ? `${timeLabel} · ${capsule.locationName ?? "위치 조건 없음"}`
      : needsTime
      ? timeLabel
      : capsule.locationName ?? "위치 조건 없음";

  const isUnlocked =
    unlockType === "TIME"
      ? isUnlockedByTime
      : unlockType === "LOCATION"
      ? isUnlockedByLocation
      : unlockType === "TIME_AND_LOCATION"
      ? isUnlockedByTime && isUnlockedByLocation
      : true;

  const statusText = isUnlocked ? "열람 가능" : "열람 불가능";

  // 위치 조건인데 아직 currentPos가 없거나 target 좌표가 없으면 안내
  const locationHint =
    needsLocation && !canCheckLocation ? "현재 위치로 확인 중..." : null;

  return {
    mode: "unlock" as const,
    isTime: needsTime,
    conditionLabel,
    isUnlocked,
    isRead,
    statusText,
    locationHint,
  };
}

/* 뒷면 색상 */
function clamp(n: number, min = 0, max = 255) {
  return Math.max(min, Math.min(max, n));
}

function normalizeHex(hex: unknown, fallback = "#FFDED8") {
  if (typeof hex !== "string" || hex.trim() === "") return fallback;

  const h = hex.trim().startsWith("#") ? hex.trim() : `#${hex.trim()}`;

  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h)) return fallback;
  return h;
}

function hexToRgb(hex: unknown) {
  const safe = normalizeHex(hex);
  const h = safe.replace("#", "");

  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const num = parseInt(full, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function shiftColor(hex: unknown, amount: number, fallback = "#FFDED8") {
  const safe = normalizeHex(hex, fallback);
  const { r, g, b } = hexToRgb(safe);
  return rgbToHex(r + amount, g + amount, b + amount);
}

export default function EnvelopeCard({
  capsule,
  type,
  currentPos = null,
}: Props) {
  const router = useRouter();

  const status = useMemo(
    () => getEnvelopeStatus(capsule, type, currentPos),
    [capsule, type, currentPos]
  );

  const href = `/dashboard/${type}?id=${capsule.capsuleId}`;

  // send는 항상 상세 진입 가능
  const canOpenDetail =
    type === "send" || (status.mode === "unlock" && status.isUnlocked);

  // 모바일 1탭 플립 상태
  const [flipped, setFlipped] = useState(false);

  const [animating, setAnimating] = useState(false);
  const FLIP_MS = 700; // transition duration과 맞춤

  const cardRef = useRef<HTMLDivElement | null>(null);

  const canHover = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const rotateClass = canHover
    ? "group-hover:transform-[rotateY(180deg)]"
    : flipped
    ? "transform-[rotateY(180deg)]"
    : "transform-[rotateY(0deg)]";

  useEffect(() => {
    if (!flipped) return;

    const onPointerDownCapture = (ev: PointerEvent) => {
      const el = cardRef.current;
      if (!el) return;
      const target = ev.target as Node | null;

      // 카드 내부 터치면 무시
      if (target && el.contains(target)) return;

      setFlipped(false);
    };

    document.addEventListener("pointerdown", onPointerDownCapture, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
    };
  }, [flipped]);

  const handleClick = (e: React.MouseEvent) => {
    if (animating) return;

    // 데스크탑(hover 가능)에서는 "열 수 있는 편지"만 바로 이동
    if (canHover) {
      if (!canOpenDetail) return;
      router.push(href, { scroll: false });
      return;
    }

    // 모바일(hover 불가): 1번 탭 => 뒤집기 (잠겨 있어도 OK)
    if (!flipped) {
      e.preventDefault();
      setAnimating(true);
      requestAnimationFrame(() => setFlipped(true));
      window.setTimeout(() => setAnimating(false), FLIP_MS);
      return;
    }

    // 모바일 2번 탭 => 열 수 있을 때만 이동
    if (!canOpenDetail) return;
    router.push(href, { scroll: false });
  };

  const ReadBadgeSlot = () => {
    if (type === "send") return null;

    return status.mode === "unlock" && status.isUnlocked && status.isRead ? (
      <div className="absolute top-3 left-3 z-10">
        <div className="px-2 py-1 rounded-full text-xs bg-white/80 shadow">
          읽음
        </div>
      </div>
    ) : null;
  };

  const DEFAULT_HEX = CAPTURE_COLOR_MAP.BEIGE ?? "#FFDED8";

  const packingKey = (capsule.capsulePackingColor ?? "BEIGE")
    .toString()
    .trim()
    .toUpperCase() as keyof typeof CAPTURE_COLOR_MAP;

  const packingHex = CAPTURE_COLOR_MAP[packingKey] ?? DEFAULT_HEX;

  const backBase = packingHex;
  const backShade1 = shiftColor(backBase, 0); // 바닥
  const backShade2 = shiftColor(backBase, -5); // 아래 삼각
  const backShade3 = shiftColor(backBase, +5); // 위 삼각 (조금 밝게)

  const CardInner = () => (
    <div
      ref={cardRef}
      className="relative flex flex-col items-center justify-center p-2 perspective-[1000px] group"
      aria-label={canOpenDetail ? "봉투 카드" : "열 수 없는 봉투"}
    >
      <ReadBadgeSlot />

      <div
        className={[
          "relative w-full md:w-70 h-45 transform-3d will-change-transform",
          "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          rotateClass,
        ].join(" ")}
      >
        {/* 앞면 */}
        <div className="absolute inset-0 backface-hidden">
          <div
            className="relative w-full h-full p-3"
            style={{ backgroundColor: backBase }}
          >
            <div className="flex justify-between h-full text-sm">
              <div className="w-2/5">
                <p className="line-clamp-1">
                  Dear.{capsule.recipient ?? "(수신자 정보 없음)"}
                </p>
                <div className="space-y-2">
                  <div className="w-full h-px bg-white"></div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-white" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-2/5 h-full flex flex-col">
                <div className="flex flex-col items-end mt-auto">
                  <p className="line-clamp-1">From. {capsule.sender}</p>
                  <div className="w-full space-y-2">
                    <div className="w-full h-px bg-white"></div>
                    <div className="flex justify-end gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-white" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-1/2 w-30">
              <p className="text-center text-sm line-clamp-3 break-keep">
                {capsule.title}
              </p>
            </div>

            <div className="absolute top-0 right-0">
              <div className="text-primary p-4 space-y-2">
                {type === "send" ? (
                  status.mode === "send" && status.canEdit ? (
                    <Pencil size={16} />
                  ) : (
                    <PencilOff size={16} />
                  )
                ) : status.mode === "unlock" && status.isTime ? (
                  <Clock size={16} />
                ) : (
                  <MapPin size={16} />
                )}
              </div>
            </div>

            <div className="absolute bottom-3 left-3 text-white">
              <Logo className="w-5" />
            </div>
          </div>
        </div>

        {/* 뒷면 */}
        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)]">
          <div className="w-full h-full flex items-center justify-center">
            <div className="absolute inset-0">
              <svg width="280" height="180" viewBox="0 0 280 180" fill="none">
                <path d="M0 0H280V180H0V0Z" fill={backShade1} />
                <path d="M280 180H0L140 86L280 180Z" fill={backShade2} />
                <path d="M280 0H0L140 118L280 0Z" fill={backShade3} />
              </svg>
            </div>

            <div className="relative text-text-2 flex flex-col items-center justify-center gap-2">
              {type === "send" && status.mode === "send" ? (
                <>
                  <span className="font-medium">{status.statusText}</span>
                  <div className="w-15 h-15 rounded-full bg-white shadow-lg flex items-center justify-center">
                    {status.isRead ? <Lock /> : <Unlock />}
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white shadow-lg">
                    {status.canEdit ? (
                      <Pencil size={14} />
                    ) : (
                      <PencilOff size={14} />
                    )}
                    <span className="text-xs">{status.editText}</span>
                  </div>
                  {status.canEdit ? (
                    <span className="text-xs">클릭하여 확인/수정</span>
                  ) : (
                    <span className="text-xs text-text-3">
                      열람 후에는 수정할 수 없어요
                    </span>
                  )}
                </>
              ) : status.mode === "unlock" ? (
                <>
                  <span className="font-medium">{status.statusText}</span>
                  <div className="w-15 h-15 rounded-full bg-white shadow-lg flex items-center justify-center">
                    {status.isUnlocked ? <Unlock /> : <Lock />}
                  </div>

                  {status.isUnlocked && !status.isRead ? (
                    <span className="text-xs">클릭하여 읽기</span>
                  ) : null}

                  {!status.isUnlocked ? (
                    <>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white shadow-lg">
                        {status.isTime ? (
                          <Clock size={14} />
                        ) : (
                          <MapPin size={14} />
                        )}
                        <span className="text-xs line-clamp-1">
                          {status.conditionLabel}
                        </span>
                      </div>

                      <span className="text-xs text-text-3">
                        {status.locationHint ?? "해제 후 열람 가능"}
                      </span>
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute w-60 h-px rounded-[30%]"
        style={{ boxShadow: "20px 100px 10px 5px #EEEEF3" }}
      />
    </div>
  );

  return (
    <div
      role="button"
      tabIndex={0}
      className={[
        "block",
        canOpenDetail ? "cursor-pointer" : "cursor-not-allowed opacity-80",
      ].join(" ")}
      aria-disabled={!canOpenDetail}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key !== "Enter") return;

        if (!canOpenDetail) return;
        router.push(href, { scroll: false });
      }}
    >
      <CardInner />
    </div>
  );
}
