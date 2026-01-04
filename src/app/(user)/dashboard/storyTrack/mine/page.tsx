import MineTrackPage from "@/components/dashboard/storyTrack/mine/MineTrackPage";
import StorytrackPageSkeleton from "@/components/skeleton/dashboard/storytrack/StorytrackPageSkeleton";
import { Suspense } from "react";

export default function MinePage() {
  return (
    <>
      <Suspense fallback={<StorytrackPageSkeleton />}>
        <MineTrackPage />
      </Suspense>
    </>
  );
}
