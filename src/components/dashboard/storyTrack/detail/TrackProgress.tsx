"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Flag } from "lucide-react";

export default function TrackProgress() {
  const [collapsed, setCollapsed] = useState(true);

  const completed = 2;
  const total = 5;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className={`p-6  border-outline ${
          collapsed ? "border-none" : "border-b"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex-none text-xl flex items-center gap-2">
            <span>진행 상황</span>
            <span className="text-sm text-primary-2">{percent}% 완료</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-32 h-1.5 bg-outline rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-2"
                style={{ width: `${(completed / total) * 100}%` }}
              />
            </div>

            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="cursor-pointer p-1 rounded-lg hover:bg-outline/40"
              aria-expanded={!collapsed}
              aria-label={collapsed ? "펼치기" : "접기"}
            >
              {collapsed ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Body (collapsible) */}
      <div
        className={[
          "grid transition-all duration-200 ease-out",
          collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
        ].join(" ")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-4 p-6">
            {/* 경로 */}
            <div className="flex gap-4">
              <div className="flex-1 border border-outline rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs text-text-3">완료한 장소</span>
                <span className="text-xl">{completed}</span>
              </div>
              <div className="flex-1 border border-outline rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs text-text-3">남은 장소</span>
                <span className="text-xl">{total - completed}</span>
              </div>
              <div className="flex-1 border border-outline rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs text-text-3">전체 장소</span>
                <span className="text-xl">{total}</span>
              </div>
            </div>

            {/* 다음 목적지 */}
            <div className="w-full border border-outline rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Flag size={20} className="text-primary" />
                <span>다음 목적지</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg">잠실 한강공원</p>
                <p className="text-sm text-text-3">
                  서울특별시 송파구 올림픽로 139
                </p>
              </div>
            </div>

            {/* 시작일 / 최근 방문 */}
            <div className="w-full border border-outline rounded-xl p-4 flex">
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-text-3 text-sm">시작일</span>
                <span>2024. 12. 20</span>
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-text-3 text-sm">최근 방문</span>
                <span>2024. 12. 21</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
