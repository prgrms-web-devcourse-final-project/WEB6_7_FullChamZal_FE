import ModerationSection from "@/components/dashboard/admin/contents/page/ModerationSection";
import AdminDashboardPageSkeleton from "@/components/ui/skeleton/admin/AdminDashboardPageSkeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<AdminDashboardPageSkeleton />}>
        <ModerationSection />
      </Suspense>
    </>
  );
}
