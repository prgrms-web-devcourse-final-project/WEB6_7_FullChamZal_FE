import { Suspense } from "react";

export default function AllPage() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <h1>AllPage</h1>
      </Suspense>
    </>
  );
}
