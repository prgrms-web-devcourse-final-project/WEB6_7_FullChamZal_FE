"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        className="flex-none cursor-pointer inline-flex items-center gap-1 text-text-3 hover:text-text"
      >
        <ArrowLeft size={20} />
        돌아가기
      </button>
    </>
  );
}
