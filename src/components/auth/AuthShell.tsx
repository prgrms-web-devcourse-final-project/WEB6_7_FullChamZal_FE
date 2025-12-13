"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function AuthShell({
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <section className="w-full max-w-xl min-h-180 py-20 px-8">
      {/* 상단 뒤로가기 */}
      <Link
        href="/"
        className="cursor-pointer flex items-center gap-1 text-text-3 ml-4 mb-4 hover:text-text "
      >
        <ArrowLeft size={18} />
        <span className="text-sm">홈으로</span>
      </Link>

      <div className="w-full p-6 md:p-10 rounded-t-3xl bg-sub border border-outline space-y-4 md:space-y-8 shadow-xl">
        <AuthHeader title={title} description={description} />

        {/* 여기부터 각 페이지 전용 폼 들어감 */}
        {children}
      </div>
      <AuthFooter title={title} />
    </section>
  );
}
