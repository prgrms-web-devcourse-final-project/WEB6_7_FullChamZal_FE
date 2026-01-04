import ReportSection from "@/components/dashboard/admin/contents/page/ReportSection";
import AdminDashboardPageSkeleton from "@/components/skeleton/admin/AdminDashboardPageSkeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<AdminDashboardPageSkeleton />}>
        <ReportSection />
      </Suspense>
    </>
  );
}
