import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthShell
          title="로그인"
          description="Dear. ___ 에 다시 오신 걸 환영해요."
        >
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-5">
              <div className="h-16 rounded-xl bg-white/60 animate-pulse border border-outline" />
              <div className="h-16 rounded-xl bg-white/60 animate-pulse border border-outline" />
              <div className="h-4 w-40 ml-auto rounded bg-white/60 animate-pulse" />
            </div>
            <div className="h-12 rounded-xl bg-white/60 animate-pulse border border-outline" />
          </div>
        </AuthShell>
      }
    >
      <AuthShell
        title="로그인"
        description="Dear. ___ 에 다시 오신 걸 환영해요."
      >
        <LoginForm />
      </AuthShell>
    </Suspense>
  );
}
