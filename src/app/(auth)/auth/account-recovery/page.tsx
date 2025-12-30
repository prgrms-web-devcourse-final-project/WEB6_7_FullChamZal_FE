import AccountRecoveryPage from "@/components/auth/Account-recovery";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">로딩 중...</div>}>
      <AccountRecoveryPage />
    </Suspense>
  );
}
