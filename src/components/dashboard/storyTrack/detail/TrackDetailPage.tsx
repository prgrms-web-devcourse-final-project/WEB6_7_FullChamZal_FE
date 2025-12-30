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
  const [tab, setTab] = useState<TabType>("route");

  return (
    <div className="h-screen flex flex-col p-8 gap-8">
      <div>
        <BackButton />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden flex gap-6">
        {/* Left */}
        <div className="flex-1 min-w-80 flex flex-col h-full gap-6 min-h-0">
          <div className="border border-outline rounded-2xl">
            <TrackHeader />
          </div>
          <div className="border border-outline rounded-2xl flex-1 min-h-0 overflow-hidden">
            <TrackOverview />
          </div>
        </div>

        {/* Right */}
        <div className="flex-3 flex flex-col gap-6 min-h-0">
          {/* Top */}
          <div className="border border-outline rounded-2xl overflow-hidden">
            <TrackProgress />
          </div>

          {/* Bottom */}
          <div className="border border-outline rounded-2xl flex-1 min-h-0 overflow-hidden flex flex-col">
            {/* 탭 메뉴 */}
            <TrackTabMenu activeTab={tab} onChange={setTab} />

            {/* 탭 컨텐츠 */}
            <div className="flex-1 min-h-0 overflow-auto p-6">
              {tab === "route" && <TrackRoute />}
              {tab === "map" && <TrackMap />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
