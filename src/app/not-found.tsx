/* eslint-disable react-hooks/purity */
// app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ArrowLeft, Home, Mail } from "lucide-react";
import Logo from "@/components/common/Logo";

const POINT = "#FF2600";

export default function NotFound() {
  const router = useRouter();

  const tagline = useMemo(() => {
    const options = [
      "이 편지는 길을 잃었어요.",
      "주소가 살짝 틀린 것 같아요.",
      "찾는 페이지가 잠시 외출했어요.",
      "여긴 비어있어요. 대신 편지를 보내볼까요?",
    ];
    return options[Math.floor(Math.random() * options.length)];
  }, []);

  return (
    <main className="min-h-screen w-full">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full blur-3xl bg-primary/5" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16">
        {/* brand */}
        <div className="mb-8 flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur text-primary">
          <Logo className="h-8 w-8" />
          <span className="text-2xl font-medium">
            Dear.<span className="tracking-wide">___</span>
          </span>
        </div>

        {/* card */}
        <div className="w-full max-w-2xl rounded-3xl bg-bg/80 p-8 shadow-lg backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-semibold tracking-tight sm:text-5xl">
              <span className="text-6xl text-primary">404</span>{" "}
              <span className="text-4xl text-text-4">Not Found</span>
            </h1>

            <p className="mt-3 max-w-md font-semibold leading-relaxed text-text-2">
              {tagline}
              <br className="hidden sm:block" />
              주소를 다시 확인하거나 홈으로 돌아가세요.
            </p>

            {/* flying letter */}
            <div className="mt-8 w-full">
              <div className="relative mx-auto h-50 max-w-xl overflow-hidden rounded-2xl">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <div className="fly relative">
                    <div className="absolute -inset-3 rounded-full blur-xl bg-primary-5" />
                    <div className="relative rounded-2xl border border-outline bg-bg px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5" style={{ color: POINT }} />
                        <span className="text-sm font-medium">
                          Deer message
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-36 rounded-full bg-zinc-100" />
                      <div className="mt-1 h-2 w-28 rounded-full bg-zinc-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.push("/")}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-sm transition active:scale-[0.99] bg-primary-2 hover:bg-primary-3"
              >
                <Home className="h-4 w-4" />
                홈으로
              </button>

              <button
                onClick={() => router.back()}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl border border-outline px-5 py-3 text-sm font-medium transition hover:bg-sub"
              >
                <ArrowLeft className="h-4 w-4" />
                이전으로
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
