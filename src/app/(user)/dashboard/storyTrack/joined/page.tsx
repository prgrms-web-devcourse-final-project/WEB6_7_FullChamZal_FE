import JoinedTrackPage from "@/components/dashboard/storyTrack/joined/JoinedTrackPage";
import { Suspense } from "react";

export default function JoinedPage() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <JoinedTrackPage />
      </Suspense>
    </>
  );
}
