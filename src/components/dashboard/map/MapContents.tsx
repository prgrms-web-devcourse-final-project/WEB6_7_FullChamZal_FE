"use client";

import { Filter as FilterIcon, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MapList from "./MapList";
import FilterArea from "./FilterArea";

export type Radius = 1500 | 1000 | 500;
export type ViewedFilter = "ALL" | "UNREAD" | "READ";

export default function MapContents() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [radius, setRadius] = useState<Radius>(1500);
  const [viewed, setViewed] = useState<ViewedFilter>("ALL");

  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!filterRef.current) return;
      if (!filterRef.current.contains(e.target as Node)) setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* 헤더 */}
      <div className="space-y-2">
        <h3 className="text-3xl font-medium">
          공개 편지 지도
          <span className="text-primary px-1">_</span>
        </h3>
        <p className="text-text-2">
          주변에 숨겨진 <span className="text-primary font-semibold">6개</span>
          의 편지를 찾아보세요
        </p>
      </div>

      {/* 검색 */}
      <div className="relative w-full">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-4"
        />
        <input
          type="text"
          placeholder="장소, 제목으로 검색..."
          className="w-full p-4 pl-12 bg-white/80 border border-outline rounded-xl outline-none focus:border-primary-2"
        />
      </div>

      {/* 지도 + 리스트 영역 */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* 지도 */}
        <div className="flex-1 rounded-xl bg-sub border border-outline" />

        {/* 리스트 */}
        <div className="w-[360px] rounded-xl bg-white/80 border border-outline flex flex-col gap-8 min-h-0 py-6">
          <div className="flex justify-between flex-none px-6 items-center">
            <span className="text-lg">주변 편지</span>

            {/* 필터 */}
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen((v) => !v)}
                className="p-2 rounded-lg hover:bg-sub transition"
                aria-haspopup="menu"
                aria-expanded={isFilterOpen}
              >
                <FilterIcon size={16} className="text-primary" />
              </button>

              {isFilterOpen && (
                <FilterArea
                  radius={radius}
                  onRadiusChange={setRadius}
                  viewed={viewed}
                  onViewedChange={setViewed}
                  onClose={() => setIsFilterOpen(false)}
                  onReset={() => {
                    setRadius(500);
                    setViewed("ALL");
                  }}
                />
              )}
            </div>
          </div>

          {/* 리스트 영역 */}
          <MapList />
        </div>
      </div>
    </div>
  );
}
