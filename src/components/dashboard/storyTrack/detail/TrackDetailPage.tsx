"use client";

import { useState } from "react";
import BackButton from "@/components/common/BackButton";
import TrackHeader from "./TrackHeader";
import TrackTabMenu from "./TrackTabMenu";
import TrackOverview from "./TrackOverview";
import TrackRoute from "./TrackRoute";
import TrackProgress from "./TrackProgress";

export default function TrackDetailPage() {
  const [tab, setTab] = useState<"overview" | "route" | "progress">("overview");

  return (
    <div className="h-screen flex flex-col p-8 gap-8">
      <div>
        <BackButton />
      </div>

      <div className="flex-1 min-h-0 border border-outline rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <TrackHeader />

        {/* Menu */}
        <TrackTabMenu activeTab={tab} onChange={setTab} />

        {/* Contents */}
        <div className="flex-1 overflow-auto">
          {tab === "overview" && <TrackOverview />}
          {tab === "route" && <TrackRoute />}
          {/* 작성자라면 이 탭도 보이지 않도록 처리 */}
          {tab === "progress" && <TrackProgress />}
        </div>
      </div>
    </div>
  );
}
