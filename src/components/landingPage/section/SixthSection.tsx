"use client";

import { ArrowRight } from "lucide-react";
import Button from "../../common/tag/Button";
import { useRouter } from "next/navigation";
import { authApiClient } from "@/lib/api/auth/auth.client";

export default function SixthSection() {
  const router = useRouter();

  const handleWrite = async () => {
    try {
      const loggedIn = await authApiClient.isLoggedIn();

      if (!loggedIn) {
        router.push(
          `/auth/login?callback=${encodeURIComponent("/capsules/new")}`
        );
        return;
      }

      router.push("/capsules/new");
    } catch (e) {
      // 네트워크 오류 등 → 로그인으로 보내는 게 안전
      router.push(
        `/auth/login?callback=${encodeURIComponent("/capsules/new")}`
      );
    }
  };

  return (
    <section
      id="start"
      className="relative w-full overflow-hidden py-20 md:py-60"
    >
      <div className="max-w-80 mx-auto space-y-25">
        <div className="w-full text-center space-y-5">
          <h3 className="text-4xl font-bold leading-12">
            첫 번째 편지를
            <br />
            시작해 보세요.
          </h3>

          <p>
            지금 작성한 편지가 언젠가 누군가에게
            <br />
            특별한 순간을 만들어줄 것입니다
          </p>

          <div className="space-x-4 text-sm md:text-base font-medium mt-8 md:mt-20">
            <Button
              onClick={handleWrite}
              className="bg-[#ff2600] py-4 px-5 font-medium space-x-1"
            >
              <span>편지 쓰기</span> <ArrowRight size={20} />
            </Button>

            <Button
              onClick={() => router.push("/auth/login")}
              className="border border-outline py-4 px-5 bg-white hover:bg-button-hover text-[#070d19]"
            >
              로그인
            </Button>
          </div>
        </div>

        <div className="text-[#525252] space-y-4 text-center">
          <p>당신만의 이야기를 만들어보세요</p>
          <div className="flex gap-4 items-center justify-center">
            <span className="w-12 h-px bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,#A1A1A1_100%)]" />
            <span>느리지만 확실하게</span>
            <span className="w-12 h-px bg-[linear-gradient(270deg,rgba(0,0,0,0)_0%,#A1A1A1_100%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
