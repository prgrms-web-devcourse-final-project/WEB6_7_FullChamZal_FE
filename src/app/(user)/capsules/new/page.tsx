import WritePage from "@/components/capsule/new/WritePage";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <WritePage />
      </Suspense>
    </>
  );
}
