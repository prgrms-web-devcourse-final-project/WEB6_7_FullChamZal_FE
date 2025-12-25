"use client";

import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import TrackCard from "./TrackCard";

export default function AllTrackPage() {
  const router = useRouter();
  return (
    <>
      <div className="p-8 space-y-6">
        {/* Top */}
        <div className="space-y-3 flex-none">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-1 text-text-3 hover:text-text"
          >
            <ArrowLeft size={20} />
            돌아가기
          </button>

          <div className="space-y-2">
            <h3 className="text-3xl font-medium">
              공개 스토리트랙 둘러보기
              <span className="text-primary px-1">_</span>
            </h3>
            <p className="text-text-2">
              다양한 스토리트랙을 탐색하고 참여해보세요
            </p>
          </div>
        </div>

        {/* 검색 */}
        <div className="relative w-full">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-4"
          />
          <input
            type="text"
            placeholder="스토리트랙 검색..."
            className="w-full p-4 pl-12 bg-white/80 border border-outline rounded-xl outline-none focus:border-primary-2"
          />
        </div>

        {/* List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <TrackCard />
        </div>
      </div>
    </>
  );
}
