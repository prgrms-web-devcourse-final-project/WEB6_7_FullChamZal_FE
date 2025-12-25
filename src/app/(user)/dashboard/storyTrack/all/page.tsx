import AllTrackPage from "@/components/dashboard/storyTrack/all/AllTrackPage";
import { Suspense } from "react";

export default function AllPage() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <AllTrackPage />
      </Suspense>
    </>
  );
}
