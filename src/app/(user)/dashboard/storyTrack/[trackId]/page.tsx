import TrackDetailPage from "@/components/dashboard/storyTrack/detail/TrackDetailPage";
import TrackDetailSkeleton from "@/components/skeleton/dashboard/storytrack/TrackDetailSkeleton";
import { Suspense } from "react";

export default function StoryTrackDetailPage() {
  return (
    <>
      <Suspense fallback={<TrackDetailSkeleton />}>
        <TrackDetailPage />
      </Suspense>
    </>
  );
}
