import CreateStoryTrack from "@/components/dashboard/storyTrack/new/CreateStoryTrack";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <CreateStoryTrack />
      </Suspense>
    </>
  );
}
