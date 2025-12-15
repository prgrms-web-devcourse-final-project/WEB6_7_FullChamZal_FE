"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Input from "@/components/common/Input";
import { useState } from "react";
import Button from "../common/Button";
import { useRouter } from "next/navigation";
import { login, me } from "@/lib/api/auth/auth";

export default function LoginForm() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    setLoading(true);
    try {
      // 1) 로그인 성공 (쿠키 저장)
      await login({ userId: id, password: pw });

      // 2) 내 정보 조회 (role 확인)
      const profile = await me();
      console.log(profile.data.role);

      if (profile.data.role === "ADMIN") {
        router.replace("/admin/dashboard/users");
        router.refresh();
      } else {
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message ?? "로그인에 실패했습니다.");
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
        />

        {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

        <div className="text-text-4 text-xs space-x-2 text-right">
          <button
            type="button"
            className="cursor-pointer underline hover:text-text-3"
          >
            아이디 찾기
          </button>
          <button
            type="button"
            className="cursor-pointer underline hover:text-text-3"
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
