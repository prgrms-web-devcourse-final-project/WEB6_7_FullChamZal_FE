import DashBoardMain from "@/components/dashboard/contents/main/DashBoardMain";
import DashboardHomeSkeleton from "@/components/ui/skeleton/dashboard/home/DashboardHomeSkeleton";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <>
      <Suspense fallback={<DashboardHomeSkeleton />}>
        <div className="pt-8 p-4 lg:p-8">
          <DashBoardMain />
        </div>
      </Suspense>
    </>
  );
}
