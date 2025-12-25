import { Suspense } from "react";

export default function StoryTrackDetailPage() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <h1>StoryTrackDetailPage</h1>
      </Suspense>
    </>
  );
}
