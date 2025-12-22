import ModerationSection from "@/components/dashboard/admin/contents/page/ModerationSection";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <ModerationSection />
      </Suspense>
    </>
  );
}
