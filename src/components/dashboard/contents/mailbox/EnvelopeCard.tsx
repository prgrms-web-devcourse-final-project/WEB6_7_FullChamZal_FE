"use client";

import { formatDateTime } from "@/lib/formatDateTime";
import Logo from "@/components/common/Logo";
import { Clock, Lock, MapPin, Unlock } from "lucide-react";
import Link from "next/link";

export default function EnvelopeCard({ capsule }: { capsule: Capsule }) {
  const isTime = capsule.unlockCondition.type === "time";

  const conditionLabel =
    capsule.unlockCondition.type === "time"
      ? formatDateTime(capsule.unlockCondition.at)
      : capsule.unlockCondition.address;

  const statusText = capsule.isUnlocked ? "열람 가능" : "열람 불가능";

  return (
    <Link
      href={`/dashboard/send?id=${capsule.id}`}
      scroll={false}
      className="relative flex flex-col items-center justify-center py-8 perspective-[1000px] group"
    >
      {/* Flip wrapper */}
      <div className=" relative w-[280px] h-[180px] transition-transform duration-500 transform-3d group-hover:transform-[rotateY(180deg)]">
        {/* ------------------------- 앞면 (기본 보임) ------------------------- */}
        <div className="absolute inset-0 backface-hidden">
          <div className="relative w-full h-full bg-linear-to-b from-[#FFEAEA] to-[#FDCACA] p-3">
            <div className="flex justify-between h-full text-sm">
              {/* 보낸 사람 */}
              <div className="w-2/5">
                <p className="line-clamp-1">Dear.{capsule.to}</p>
                <div className="space-y-2">
                  <div className="w-full h-px bg-white"></div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-white" />
                    ))}
                  </div>
                </div>
              </div>

              {/* 오른쪽 */}
              <div className="w-2/5 h-full flex flex-col">
                <div className="flex flex-col items-end mt-auto">
                  <p className="line-clamp-1">From. {capsule.from}</p>
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

            {/* 조건에 따라 시간인지 장소인지 핀으로 표시 */}
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

        {/* ------------------------- 뒷면 (hover 시 보임) ------------------------- */}
        {/*  */}
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
                <path d="M0 0H280V180H0V0Z" fill="#FFDFDF" />
                <path d="M280 180H0L140 86L280 180Z" fill="#FFD3D3" />
                <path d="M280 0H0L140 118L280 0Z" fill="#FFEAEA" />
              </svg>
            </div>
            <div className="relative text-text-2 flex flex-col items-center justify-center gap-2">
              <span className="font-medium">{statusText}</span>
              <div className="w-15 h-15 rounded-full bg-white shadow-lg flex items-center justify-center">
                {capsule.isUnlocked ? <Unlock /> : <Lock />}
              </div>

              {/* 열람 가능일 때만 안내 문구 */}
              {capsule.isUnlocked && !capsule.isRead ? (
                <span className="text-xs">클릭하여 읽기</span>
              ) : null}

              {/* 해제 조건 뱃지 */}
              {!capsule.isUnlocked ? (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white shadow-lg">
                  {isTime ? <Clock size={14} /> : <MapPin size={14} />}
                  <span className="text-xs line-clamp-1">{conditionLabel}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Shadow */}
      <div
        className="absolute w-60 h-px rounded-[30%]"
        style={{ boxShadow: "20px 100px 10px 5px #EEEEF3" }}
      ></div>
    </Link>
  );
}
