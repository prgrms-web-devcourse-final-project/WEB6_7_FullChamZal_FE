"use client";

import { useState } from "react";
import BackButton from "@/components/common/BackButton";
import TrackHeader from "./TrackHeader";
import TrackOverview from "./TrackOverview";
import TrackProgress from "./TrackProgress";
import TrackTabMenu from "./TrackTabMenu";
import TrackRoute from "./TrackRoute";
import TrackMap from "./TrackMap";

type TabType = "route" | "map";

export default function TrackDetailPage() {
  const [tab, setTab] = useState<TabType>("map");

  return (
    // 모바일: 전체 스크롤
    // 데스크탑: 내부 패널 스크롤
    <div className="min-h-dvh lg:h-screen flex flex-col p-4 lg:p-8 gap-4 lg:gap-8">
      <div className="flex-none">
        <BackButton />
      </div>

      {/* 모바일: 세로 스택 / 데스크탑: 가로 2컬럼 */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-0">
        {/* Left */}
        <div className="lg:flex-1 lg:min-w-80 flex flex-col gap-4 lg:gap-6 min-h-0">
          <div className="border border-outline rounded-2xl overflow-hidden">
            <TrackHeader />
          </div>

          <div className="border border-outline rounded-2xl lg:flex-1 lg:min-h-0 overflow-hidden">
            <TrackOverview />
          </div>
        </div>

        {/* Right */}
        <div className="lg:flex-3 flex flex-col gap-4 lg:gap-6 min-h-0">
          {/* Top */}
          <div className="border border-outline rounded-2xl overflow-hidden">
            <TrackProgress />
          </div>

          {/* Bottom */}
          <div className="border border-outline rounded-2xl overflow-hidden flex flex-col lg:flex-1 lg:min-h-0">
            <TrackTabMenu activeTab={tab} onChange={setTab} />

            <div className="p-4 lg:p-6 overflow-visible lg:overflow-auto lg:flex-1 lg:min-h-0">
              {tab === "map" && <TrackMap />}
              {tab === "route" && <TrackRoute />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
