"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditHeader() {
  const router = useRouter();

  return (
    <>
      <header className="px-8 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="text-primary" />
          </button>
          <div className="space-y-1">
            <p className="text-xl font-medium">
              편지 수정<span className="text-primary px-1">_</span>
            </p>
            <p className="text-text-3 text-sm">편지 내용을 수정해보세요</p>
          </div>
        </div>
      </header>
    </>
  );
}

