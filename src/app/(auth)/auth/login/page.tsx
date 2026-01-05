import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";
import { authApiServer } from "@/lib/api/auth/auth.server";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { returnUrl?: string; callback?: string };
}) {
  const sp = await searchParams;

  const cb = sp.returnUrl ?? sp.callback;
  const returnUrl = cb && cb.startsWith("/") ? cb : null;

  try {
    const me = await authApiServer.me();
    const isAdmin = me.role === "ADMIN";
    const fallbackTarget = isAdmin ? "/admin/dashboard/users" : "/dashboard";
    redirect(returnUrl ?? fallbackTarget);
  } catch {}

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
