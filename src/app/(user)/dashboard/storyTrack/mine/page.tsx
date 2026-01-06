import MineTrackPage from "@/components/dashboard/storyTrack/mine/MineTrackPage";
import StorytrackPageSkeleton from "@/components/ui/skeleton/dashboard/storytrack/StorytrackPageSkeleton";
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
