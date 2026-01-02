"use client";

import Input from "@/components/common/Input";
import { useEffect, useMemo, useState } from "react";
import Button from "../common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { authApiClient } from "@/lib/api/auth/auth.client";
import { useMe } from "@/lib/hooks/useMe";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;

  if (typeof err === "object" && err !== null && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }

  return "로그인 중 오류가 발생했습니다.";
}

export default function LoginForm() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const returnUrl = useMemo(() => {
    const cb = searchParams.get("returnUrl") || searchParams.get("callback");
    return cb && cb.startsWith("/") ? cb : null;
  }, [searchParams]);

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { data: me, isLoading: meLoading } = useMe();

  useEffect(() => {
    if (meLoading) return;
    if (!me) return;

    const isAdmin = me.role === "ADMIN";
    const fallbackTarget = isAdmin ? "/admin/dashboard/users" : "/dashboard";
    const target = returnUrl ?? fallbackTarget;

    router.replace(target);
    router.refresh();
  }, [me, meLoading, returnUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!id.trim() || !pw.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      // 로그인
      await authApiClient.login({ userId: id.trim(), password: pw });

      // 내 정보 조회
      const me = await authApiClient.me();
      const isAdmin = me.role === "ADMIN";

      // 이동 경로 결정
      const fallbackTarget = isAdmin ? "/admin/dashboard/users" : "/dashboard";

      const target = returnUrl ?? fallbackTarget;

      // 이동
      router.replace(target);
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-3 md:space-y-5">
        <Input
          id="id"
          label="아이디"
          placeholder="your123"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <Input
          id="pw"
          label="비밀번호"
          type="password"
          placeholder="********"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          error={error}
        />

        <div className="text-text-4 text-xs space-x-2 text-right">
          <button
            type="button"
            className="cursor-pointer underline hover:text-text-3"
            onClick={() => router.push("/auth/account-recovery?mode=FIND_ID")}
          >
            아이디 찾기
          </button>
          <button
            type="button"
            className="cursor-pointer underline hover:text-text-3"
            onClick={() => router.push("/auth/account-recovery?mode=FIND_PW")}
          >
            비밀번호 찾기
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full py-3" disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
