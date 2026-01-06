import AllTrackPage from "@/components/dashboard/storyTrack/all/AllTrackPage";
import AllTrackPageSkeleton from "@/components/ui/skeleton/dashboard/storytrack/AllTrackPageSkeleton";
import { Suspense } from "react";

export default function AllPage() {
  return (
    <>
      <Suspense fallback={<AllTrackPageSkeleton />}>
        <AllTrackPage />
      </Suspense>
    </>
  );
}
