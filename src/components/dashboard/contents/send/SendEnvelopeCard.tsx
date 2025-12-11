"use client";

import { Clock, Lock, MapPin, Unlock } from "lucide-react";

export default function SendEnvelopeCard() {
  return (
    <div className="relative flex flex-col items-center justify-center py-8 perspective-[1000px] group">
      {/* Flip wrapper */}
      <div className=" relative w-[280px] h-[180px] transition-transform duration-500 transform-3d group-hover:transform-[rotateY(180deg)]">
        {/* ------------------------- 앞면 (기본 보임) ------------------------- */}
        <div className="absolute inset-0 backface-hidden">
          <div className="relative w-full h-full bg-linear-to-b from-[#FFEAEA] to-[#FDCACA] p-5">
            <div className="flex justify-between h-full">
              <div>
                <p>Dear.홍길동</p>
              </div>
              <div className="flex items-end">
                <p>From. 성춘향</p>
              </div>
            </div>

            <div className="absolute top-0 right-0">
              <div className="text-primary p-4 space-y-2">
                <Clock size={16} />
                <MapPin size={16} />
              </div>
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
              <span className="font-medium">열람 불가능{/* 열람 가능 */}</span>
              <div className="w-15 h-15 rounded-full bg-white shadow-lg flex items-center justify-center">
                <Lock />
                {/* Unlock */}
              </div>
              {/* <span className="text-xs">클릭하여 읽기</span> */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white shadow-lg">
                <Clock size={14} />
                <span className="text-xs">2029. 04. 12 00:00</span>
                {/* <MapPin size={14}/>
                <span className="text-xs">성산일출봉</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shadow */}
      <div
        className="absolute w-60 h-px rounded-[30%]"
        style={{ boxShadow: "20px 100px 10px 5px #eeeef3" }}
      ></div>
    </div>
  );
}
