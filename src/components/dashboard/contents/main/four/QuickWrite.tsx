"use client";

import { Clock, PencilLine } from "lucide-react";
import DivBox from "../../../DivBox";
import { useRouter } from "next/navigation";

export default function QuickWrite() {
  const router = useRouter();

  return (
    <>
      <DivBox className="cursor-auto hover:bg-sub/0">
        <div className="space-y-6 lg:space-y-8">
          <div className="flex items-center gap-3">
            <PencilLine className="text-primary" />
            <div>
              <p className="text-lg">빠른 편지 쓰기</p>
              <p className="text-sm text-text-3">
                템플릿을 선택하여 시작하세요
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <DivBox className="space-y-4">
              <Clock />
              <div className="space-y-2">
                <p>미래의 나에게</p>
                <p className="text-sm text-text-3">
                  지금으로부터 1년 뒤, 다시 만나볼 편지
                </p>
              </div>
            </DivBox>
            <DivBox className="space-y-4">
              <Clock />
              <div className="space-y-2">
                <p>뭐할지 생각</p>
                <p className="text-sm text-text-3">해서 추가하기</p>
              </div>
            </DivBox>
            <DivBox className="space-y-4">
              <Clock />
              <div className="space-y-2">
                <p>공개 편지 작성하기</p>
                <p className="text-sm text-text-3">
                  세상에 들려주고 싶은 이야기를 적어보세요
                </p>
              </div>
            </DivBox>
          </div>
          <DivBox
            className="py-4 flex items-center justify-center gap-4"
            onClick={() => router.push("/capsules/new")}
          >
            <PencilLine size={20} />
            <span>빈 편지지로 시작하기</span>
          </DivBox>
        </div>
      </DivBox>
    </>
  );
}
