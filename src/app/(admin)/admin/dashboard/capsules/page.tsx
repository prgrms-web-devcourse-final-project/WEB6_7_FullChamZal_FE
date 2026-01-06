import CapsuleSection from "@/components/dashboard/admin/contents/page/CapsuleSection";
import AdminDashboardPageSkeleton from "@/components/ui/skeleton/admin/AdminDashboardPageSkeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<AdminDashboardPageSkeleton />}>
        <CapsuleSection />
      </Suspense>
    </>
  );
}
