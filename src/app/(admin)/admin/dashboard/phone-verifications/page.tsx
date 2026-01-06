import PhoneVerificationSection from "@/components/dashboard/admin/contents/page/PhoneVerificationSection";
import AdminDashboardPageSkeleton from "@/components/ui/skeleton/admin/AdminDashboardPageSkeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<AdminDashboardPageSkeleton />}>
        <PhoneVerificationSection />
      </Suspense>
    </>
  );
}
