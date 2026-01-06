import UsersSection from "@/components/dashboard/admin/contents/page/UsersSection";
import AdminDashboardPageSkeleton from "@/components/ui/skeleton/admin/AdminDashboardPageSkeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<AdminDashboardPageSkeleton />}>
        <UsersSection />
      </Suspense>
    </>
  );
}
