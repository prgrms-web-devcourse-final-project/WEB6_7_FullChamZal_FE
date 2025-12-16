import UsersSection from "@/components/dashboard/admin/contents/page/UsersSection";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="p-8">로딩 중...</div>}>
        <UsersSection />
      </Suspense>
    </>
  );
}
