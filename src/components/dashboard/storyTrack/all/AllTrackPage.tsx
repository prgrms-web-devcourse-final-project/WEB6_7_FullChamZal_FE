"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import TrackCard from "./TrackCard";
import BackButton from "@/components/common/BackButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import Pagination from "@/components/common/Pagination";

type StatusFilter = "all" | "active" | "ended";
type SortOption = "newest" | "popular";

export default function AllTrackPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(15);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const queryClient = useQueryClient();

  // queryKey를 한 곳에서만 만들기 (prefetch에서도 그대로 재사용)
  const listQueryKey = useMemo(
    () => (p: number) =>
      ["allStoryTrack", p, size, search, status, sort] as const,
    [size, search, status, sort]
  );

  const {
    data: tracks,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: listQueryKey(page),
    queryFn: async ({ signal }) => {
      // TODO: 서버가 search/status/sort를 지원하면 params에 함께 넣기
      return await storyTrackApi.allList({ page, size }, signal);
    },
    staleTime: 30_000,
  });

  const pageInfo = tracks?.data;
  const content = pageInfo?.content ?? [];

  const totalElements = pageInfo?.totalElements ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const lastPage = totalPages - 1;

  // 인접 페이지 프리패치 (이전/다음)
  useEffect(() => {
    // totalElements가 없거나 로딩 중이면 스킵
    if (!pageInfo) return;

    const prefetch = (p: number) =>
      queryClient.prefetchQuery({
        queryKey: listQueryKey(p),
        queryFn: ({ signal }) =>
          storyTrackApi.allList({ page: p, size }, signal),
        staleTime: 30_000,
      });

    if (page > 0) prefetch(page - 1);
    if (page < lastPage) prefetch(page + 1);
  }, [pageInfo, page, lastPage, size, queryClient, listQueryKey]);

  return (
    <div className="p-4 space-y-4 lg:p-8 lg:space-y-6">
      <div className="space-y-3 flex-none">
        <BackButton />
        <div className="space-y-2">
          <h3 className="text-xl lg:text-3xl font-medium">
            공개 스토리트랙 둘러보기
            <span className="text-primary px-1">_</span>
          </h3>
          <p className="text-sm lg:text-base text-text-2">
            다양한 스토리트랙을 탐색하고 참여해보세요
          </p>
        </div>
      </div>

      <div className="relative w-full">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-4"
        />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); // 검색 바뀌면 첫 페이지로
          }}
          type="text"
          placeholder="스토리트랙 검색..."
          className="w-full p-4 pl-12 bg-white/80 border border-outline rounded-xl outline-none focus:border-primary-2"
        />
      </div>

      {isLoading && (
        <div className="rounded-xl border border-outline bg-white/80 p-6 text-text-2">
          불러오는 중...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-outline bg-white/80 p-6">
          <p className="text-primary font-medium">불러오기에 실패했어요.</p>
          <pre className="mt-3 text-xs whitespace-pre-wrap text-text-3">
            {error instanceof Error ? error.message : String(error)}
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

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setStatus("all");
              setPage(0);
            }}
            className={`px-3 py-2 rounded-xl border ${
              status === "all"
                ? "border-primary text-primary"
                : "border-outline text-text-2"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => {
              setStatus("active");
              setPage(0);
            }}
            className={`cursor-pointer px-3 py-2 rounded-xl border ${
              status === "active"
                ? "border-primary text-primary"
                : "border-outline text-text-2"
            }`}
          >
            미참여
          </button>
          <button
            onClick={() => {
              setStatus("ended");
              setPage(0);
            }}
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

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortOption);
              setPage(0);
            }}
            className="appearance-none h-11 pl-4 pr-10 rounded-xl border border-outline bg-white/80 text-text-2 outline-none transition hover:bg-white hover:border-primary-2 focus:border-primary"
          >
            <option value="newest">최신순</option>
            <option value="popular">인기순</option>
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-4"
          />
        </div>

        <button
          onClick={() => {
            setSearch("");
            setStatus("all");
            setSort("newest");
            setPage(0);
          }}
          className="px-3 py-2 rounded-xl border border-outline text-text-2"
        >
          초기화
        </button>
      </div>

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {content.map((t) => (
              <TrackCard key={t.storytrackId} track={t} />
            ))}

            {content.length === 0 && (
              <div className="col-span-full text-center text-text-3 py-12">
                조건에 맞는 트랙이 없어요.
              </div>
            )}
          </div>

          <Pagination
            page={page}
            size={size}
            totalElements={totalElements}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
