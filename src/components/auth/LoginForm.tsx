"use client";

import Input from "@/components/common/Input";
import { useState } from "react";
import Button from "../common/Button";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth"; 
import { ApiError } from "@/lib/api/fetchClient"; 

export default function LoginForm() {
  const router = useRouter(); 

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const [errorMsg, setErrorMsg] = useState(""); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      //  로그인 API 호출
      await authApi.login({ userId: id, password: pw });

      //  쿠키가 저장/전송 되는지 확인용 (성공하면 인증 OK)
      await authApi.me();

      
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "AUTH004") setErrorMsg("아이디가 존재하지 않습니다.");
        else if (err.code === "AUTH005") setErrorMsg("비밀번호가 일치하지 않습니다.");
        else setErrorMsg(err.message);
      } else {
        setErrorMsg("로그인 중 오류가 발생했습니다.");
      }
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

        {/* ✅ 추가: 에러 메시지 한 줄만 (퍼블리싱 거의 안 건드림) */}
        {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

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
