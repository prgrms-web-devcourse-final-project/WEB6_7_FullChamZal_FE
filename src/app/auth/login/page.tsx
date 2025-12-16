import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8">로딩 중...</div>}>
      <AuthShell
        title="로그인"
        description="Dear. ___ 에 다시 오신 걸 환영해요."
      >
        <LoginForm />
      </AuthShell>
    </Suspense>
  );
}
