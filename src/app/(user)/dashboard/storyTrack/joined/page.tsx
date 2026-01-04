import JoinedTrackPage from "@/components/dashboard/storyTrack/joined/JoinedTrackPage";
import StorytrackPageSkeleton from "@/components/skeleton/dashboard/storytrack/StorytrackPageSkeleton";
import { Suspense } from "react";

export default function JoinedPage() {
  return (
    <>
      <Suspense fallback={<StorytrackPageSkeleton />}>
        <JoinedTrackPage />
      </Suspense>
    </>
  );
}
