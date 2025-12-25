/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import TrackCard from "./TrackCard";
import BackButton from "@/components/common/BackButton";

type Track = {
  id: number;
  title: string;
  description: string;
  createdAt: string; // ISO
  likeCount: number;
  isEnded: boolean;
  // tags?: string[];
};

type StatusFilter = "all" | "active" | "ended";
type SortOption = "newest" | "popular";

export default function AllTrackPage() {
  const tracks: Track[] = [
    {
      id: 1,
      title: "한강 산책 트랙",
      description: "여의도부터 뚝섬까지",
      createdAt: "2025-12-01T10:00:00Z",
      likeCount: 12,
      isEnded: false,
    },
    {
      id: 2,
      title: "밤 산책 트랙",
      description: "야경 명소 모음",
      createdAt: "2025-10-15T10:00:00Z",
      likeCount: 40,
      isEnded: true,
    },
  ];

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const list = tracks.filter((t) => {
      // 1) 검색
      const hit =
        q.length === 0 ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);

      if (!hit) return false;

      // 2) 상태 필터
      if (status === "active") return !t.isEnded;
      if (status === "ended") return t.isEnded;

      return true; // all
    });

    // 3) 정렬
    list.sort((a, b) => {
      if (sort === "popular") return b.likeCount - a.likeCount;
      // newest
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });

    return list;
  }, [tracks, search, status, sort]);

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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <TrackCard key={t.id} /* track={t} */ />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-text-3 py-12">
            조건에 맞는 트랙이 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
