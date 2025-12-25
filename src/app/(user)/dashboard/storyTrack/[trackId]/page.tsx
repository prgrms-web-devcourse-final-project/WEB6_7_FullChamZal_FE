import TrackDetailPage from "@/components/dashboard/storyTrack/detail/TrackDetailPage";
import { Suspense } from "react";

export default function StoryTrackDetailPage() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <TrackDetailPage />
      </Suspense>
    </>
  );
}
