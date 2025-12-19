import DashBoardMain from "@/components/dashboard/contents/main/DashBoardMain";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <div className="p-8">
          <DashBoardMain />
        </div>
      </Suspense>
    </>
  );
}
