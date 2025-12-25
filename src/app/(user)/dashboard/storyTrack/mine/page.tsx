import MineTrackPage from "@/components/dashboard/storyTrack/mine/MineTrackPage";
import { Suspense } from "react";

export default function MinePage() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <MineTrackPage />
      </Suspense>
    </>
  );
}
