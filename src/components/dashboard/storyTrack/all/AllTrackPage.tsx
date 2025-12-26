"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import TrackCard from "./TrackCard";
import BackButton from "@/components/common/BackButton";
import { useQuery } from "@tanstack/react-query";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";

type StatusFilter = "all" | "active" | "ended";
type SortOption = "newest" | "popular";

export default function AllTrackPage() {
  /* const tracks: StoryTrackItem[] = [
    {
      storytrackId: 1,
      createrName: "홍길동",
      title: "테스트 스토리트랙",
      desctiption: "SEQUENTIAL 테스트",
      trackType: "SEQUENTIAL",
      isPublic: 1,
      price: 0,
      totalSteps: 3,
      totalParticipant: 12,
      createdAt: "2025-12-21",
    },
    {
      storytrackId: 2,
      createrName: "테스터123",
      title: "테스트123213 스토리트랙",
      desctiption: "자유 테스트",
      trackType: "FREE",
      isPublic: 1,
      price: 0,
      totalSteps: 2,
      totalParticipant: 5,
      createdAt: "2025-12-19",
    },
  ]; */

  const page = 0;
  const size = 10;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const {
    data: tracks,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allStoryTrack", page, size],
    queryFn: async ({ signal }) => {
      return await storyTrackApi.allList({ page, size }, signal);
    },
  });

  return (
    <div className="p-8 space-y-6">
      {/* Top */}
      <div className="space-y-3 flex-none">
        <BackButton />

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="스토리트랙 검색..."
          className="w-full p-4 pl-12 bg-white/80 border border-outline rounded-xl outline-none focus:border-primary-2"
        />
      </div>

      {/* 로딩/에러 */}
      {isLoading && (
        <div className="rounded-xl border border-outline bg-white/80 p-6 text-text-2">
          불러오는 중...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-outline bg-white/80 p-6">
          <p className="text-primary font-medium">불러오기에 실패했어요.</p>
          <pre className="mt-3 text-xs whitespace-pre-wrap text-text-3">
            {String(error?.message ?? error)}
          </pre>
          <button
            className="mt-4 px-3 py-2 rounded-xl border border-outline text-text-2 hover:bg-white"
            onClick={() => refetch()}
            type="button"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 필터 바 */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 상태 */}
        <div className="flex gap-2">
          <button
            onClick={() => setStatus("all")}
            className={`px-3 py-2 rounded-xl border ${
              status === "all"
                ? "border-primary text-primary"
                : "border-outline text-text-2"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setStatus("active")}
            className={`cursor-pointer px-3 py-2 rounded-xl border ${
              status === "active"
                ? "border-primary text-primary"
                : "border-outline text-text-2"
            }`}
          >
            참여중
          </button>
          <button
            onClick={() => setStatus("ended")}
            className={`cursor-pointer px-3 py-2 rounded-xl border ${
              status === "ended"
                ? "border-primary text-primary"
                : "border-outline text-text-2"
            }`}
          >
            완료
          </button>
        </div>

        <div className="flex-1" />

        {/* 정렬 */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="appearance-none h-11 pl-4 pr-10 rounded-xl border border-outline bg-white/80 text-text-2 outline-none transition hover:bg-white hover:border-primary-2 focus:border-primary "
          >
            <option value="newest">최신순</option>
            <option value="popular">인기순</option>
          </select>

          {/* chevron */}
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-4"
          />
        </div>

        {/* 초기화 */}
        <button
          onClick={() => {
            setSearch("");
            setStatus("all");
            setSort("newest");
          }}
          className="px-3 py-2 rounded-xl border border-outline text-text-2"
        >
          초기화
        </button>
      </div>

      {/* List */}
      {/* 로딩/에러 아닐 때만 리스트 영역 보여주면 UX도 좋아짐 */}
      {!isLoading && !isError && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks!.data.content.map((t) => (
            <TrackCard key={t.storytrackId} track={t} />
          ))}

          {tracks!.data.content.length === 0 && (
            <div className="col-span-full text-center text-text-3 py-12">
              조건에 맞는 트랙이 없어요.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
