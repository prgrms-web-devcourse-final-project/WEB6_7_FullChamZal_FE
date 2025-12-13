"use client";

import Input from "@/components/common/Input";
import { useState } from "react";
import Button from "../common/Button";
import { redirect } from "next/navigation";

export default function LoginForm() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 API

    redirect("/dashboard");
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

      <Button type="submit" className="w-full py-3">
        로그인
      </Button>
    </form>
  );
}
