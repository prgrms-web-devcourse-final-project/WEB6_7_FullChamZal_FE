"use client";

import Button from "../../common/Button";
import Link from "next/link";

export default function SixthSection() {
  return (
    <>
      <section id="start" className="relative w-full overflow-hidden py-60">
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
            <div className="space-x-3">
              <Link href={"/capsules/new"}>
                <Button className="bg-primary text-white">
                  편지 쓰러 가기
                </Button>
              </Link>
              <Link href={"/auth/login"}>
                <Button className="rounded-xl border-2 bg-white border-primary/30">
                  로그인
                </Button>
              </Link>
            </div>
          </div>
          <div className="text-[#525252] space-y-4 text-center">
            <p>당신만의 이야기를 만들어보세요</p>
            <div className="flex gap-4 items-center justify-center">
              <span className="w-12 h-px bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,#A1A1A1_100%)]"></span>
              <span>느리지만 확실하게</span>
              <span className="w-12 h-px bg-[linear-gradient(270deg,rgba(0,0,0,0)_0%,#A1A1A1_100%)]"></span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
