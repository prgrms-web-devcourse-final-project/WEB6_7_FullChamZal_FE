"use client";

import Button from "@/components/common/Button";
import { Compass, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StoryHeader() {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row justify-between md:items-start gap-4">
        {/* Title */}
        <div className="space-y-1 lg:space-y-2">
          <h3 className="text-xl lg:text-3xl font-medium">
            스토리트랙
            <span className="text-primary px-1">_</span>
          </h3>
          <p className="text-sm lg:text-base text-text-2">
            장소를 따라가며 펼쳐지는 이야기의 여정
          </p>
        </div>

        {/* 오른쪽 */}
        <div className="flex gap-2 md:gap-6">
          <Button
            onClick={() => router.push("/dashboard/storyTrack/all")}
            className="border-2 md:font-normal px-4 py-3 md:px-5 gap-1 text-sm flex items-center justify-center bg-bg border-outline text-text hover:bg-button-hover"
            aria-label="전체 트랙 보기"
            title="전체 트랙 보기"
          >
            <Compass size={18} />
            <span className="hidden md:inline">전체 트랙 보기</span>
          </Button>

          <button
            onClick={() => router.push("/dashboard/storyTrack/new")}
            className="cursor-pointer text-white rounded-lg md:rounded-xl bg-primary-2 hover:bg-primary-3 px-4 py-3 md:px-5 gap-1 text-sm flex items-center justify-center"
            aria-label="새 트랙 만들기"
            title="새 트랙 만들기"
          >
            <Plus size={18} />
            <span className="hidden md:inline">새 트랙 만들기</span>
          </button>
        </div>
      </div>
    </>
  );
}
