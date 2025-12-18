/* eslint-disable react-hooks/static-components */
"use client";

import { formatDateTime } from "@/lib/hooks/formatDateTime";
import Logo from "@/components/common/Logo";
import { Clock, Lock, MapPin, Unlock } from "lucide-react";
import Link from "next/link";

type Props = {
  capsule: CapsuleDashboardItem;
  type: "send" | "receive" | "bookmark";
};

function getUnlockInfo(capsule: CapsuleDashboardItem) {
  const unlockType = (capsule.unlockType ?? "").toUpperCase();
  const isTime = unlockType === "TIME" || unlockType === "TIME_AND_LOCATION";

  const conditionLabel = isTime
    ? capsule.unlockAt
      ? formatDateTime(capsule.unlockAt)
      : "시간 조건 없음"
    : capsule.locationName ?? "위치 조건 없음";

  const isUnlockedByTime =
    isTime && capsule.unlockAt ? capsule.unlockAt : false;

  console.log(isUnlockedByTime);
  const isUnlocked =
    unlockType === "TIME"
      ? isUnlockedByTime
      : unlockType === "LOCATION"
      ? false
      : unlockType === "TIME_AND_LOCATION"
      ? false
      : true;
  console.log(isUnlocked);
  const isRead = Boolean(capsule.viewStatus);
  const statusText = isUnlocked ? "열람 가능" : "열람 불가능";

  return { isTime, conditionLabel, isUnlocked, isRead, statusText };
}

export default function EnvelopeCard({ capsule, type }: Props) {
  const { isTime, conditionLabel, isUnlocked, isRead, statusText } =
    getUnlockInfo(capsule);

  const href = `/dashboard/${type}?id=${capsule.capsuleId}`;

  /** "이미 읽음"일 때 넣을 UI 자리 */
  const ReadBadgeSlot = () =>
    isUnlocked && isRead ? (
      <div className="absolute top-3 left-3 z-10">
        <div className="px-2 py-1 rounded-full text-xs bg-white/80 shadow">
          읽음
        </div>
      </div>
    ) : null;

  const CardInner = () => (
    <div className="relative flex flex-col items-center justify-center py-8 perspective-[1000px] group">
      {/* 읽음 UI 슬롯 */}
      <ReadBadgeSlot />

      {/* Flip wrapper */}
      <div className="relative w-[280px] h-[180px] transition-transform duration-500 transform-3d group-hover:transform-[rotateY(180deg)]">
        {/* ------------------------- 앞면 ------------------------- */}
        <div className="absolute inset-0 backface-hidden">
          <div className="relative w-full h-full bg-linear-to-b from-[#FFEAEA] to-[#FDCACA] p-3">
            <div className="flex justify-between h-full text-sm">
              {/* 수신자 */}
              <div className="w-2/5">
                <p className="line-clamp-1">Dear.{capsule.recipient}</p>
                <div className="space-y-2">
                  <div className="w-full h-px bg-white"></div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-white" />
                    ))}
                  </div>
                </div>
              </div>

              {/* 발신자 */}
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

            {/* 가운데 제목 */}
            <div className="absolute top-1/2 left-1/2 -translate-1/2 w-30">
              <p className="text-center text-sm line-clamp-3">
                {capsule.title}
              </p>
            </div>

            {/* 조건 아이콘 */}
            <div className="absolute top-0 right-0">
              <div className="text-primary p-4 space-y-2">
                {isTime ? <Clock size={16} /> : <MapPin size={16} />}
              </div>
            </div>

            {/* 로고 */}
            <div className="absolute bottom-3 left-3 text-white">
              <Logo className="w-5" />
            </div>
          </div>
        </div>

        {/* ------------------------- 뒷면 ------------------------- */}
        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)]">
          <div className="w-full h-full flex items-center justify-center">
            <div className="absolute inset-0">
              <svg
                width="280"
                height="180"
                viewBox="0 0 280 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0H280V180H0V0Z" fill="#FFDFDF" />
                <path d="M280 180H0L140 86L280 180Z" fill="#FFD3D3" />
                <path d="M280 0H0L140 118L280 0Z" fill="#FFEAEA" />
              </svg>
            </div>

            <div className="relative text-text-2 flex flex-col items-center justify-center gap-2">
              <span className="font-medium">{statusText}</span>
              <div className="w-15 h-15 rounded-full bg-white shadow-lg flex items-center justify-center">
                {isUnlocked ? <Unlock /> : <Lock />}
              </div>

              {/* 열람 가능 + 미열람일 때 */}
              {isUnlocked && !isRead ? (
                <span className="text-xs">클릭하여 읽기</span>
              ) : null}

              {/* 잠금일 때 조건 표시 */}
              {!isUnlocked ? (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white shadow-lg">
                  {isTime ? <Clock size={14} /> : <MapPin size={14} />}
                  <span className="text-xs line-clamp-1">{conditionLabel}</span>
                </div>
              ) : null}

              {/* 해제 안 됐을 때 클릭 불가 안내(원하면) */}
              {!isUnlocked ? (
                <span className="text-xs text-text-3">해제 후 열람 가능</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Shadow */}
      <div
        className="absolute w-60 h-px rounded-[30%]"
        style={{ boxShadow: "20px 100px 10px 5px #EEEEF3" }}
      />
    </div>
  );

  // 잠김이면 Link 대신 div로 렌더 → 클릭 불가
  if (!isUnlocked) {
    return (
      <div
        className="cursor-not-allowed opacity-80"
        aria-disabled="true"
        onClick={(e) => e.preventDefault()}
      >
        <CardInner />
      </div>
    );
  }

  // 해제되면 Link로 이동 가능
  return (
    <Link href={href} scroll={false} className="block">
      <CardInner />
    </Link>
  );
}
