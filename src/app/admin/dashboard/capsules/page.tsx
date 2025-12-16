import CapsuleSection from "@/components/dashboard/admin/contents/page/CapsuleSection";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <CapsuleSection />
      </Suspense>
    </>
  );
}
