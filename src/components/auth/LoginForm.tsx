"use client";

import Input from "@/components/common/Input";
import { useState } from "react";

export default function LoginForm() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 API
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-5">
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
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl text-white font-semibold bg-primary-3 hover:bg-primary-2"
      >
        로그인
      </button>
    </form>
  );
}
