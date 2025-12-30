"use client";

import { useEffect, useState } from "react";
import StoryHeader from "../common/StoryHeader";
import StoryMenuTab from "../common/StoryMenuTab";
import MineCard from "./MineCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import Pagination from "@/components/common/Pagination";

export default function MineTrackPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(15);

  const queryClient = useQueryClient();

  const {
    data: tracks,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["joinedStoryTrack", page, size],
    queryFn: async ({ signal }) => {
      return await storyTrackApi.mineList({ page, size }, signal);
    },
  });

  const pageInfo = tracks?.data;
  const content: StoryTrackJoinedItem[] = (pageInfo?.content ??
    []) as StoryTrackJoinedItem[];

  const totalElements = pageInfo?.totalElements ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const lastPage = totalPages - 1;

  // 인접 페이지 프리패치 (이전/다음)
  useEffect(() => {
    // totalElements가 없거나 로딩 중이면 스킵
    if (!pageInfo) return;

    const prefetch = (p: number) =>
      queryClient.prefetchQuery({
        queryKey: ["joinedStoryTrack", page, size],
        queryFn: ({ signal }) =>
          storyTrackApi.allList({ page: p, size }, signal),
        staleTime: 30_000,
      });

    if (page > 0) prefetch(page - 1);
    if (page < lastPage) prefetch(page + 1);
  }, [pageInfo, page, lastPage, size, queryClient]);

  return (
    <>
      <div className="p-4 space-y-4 lg:p-8 lg:space-y-6">
        {/* 헤더 */}
        <StoryHeader />

        {/* 메뉴 탭 */}
        <StoryMenuTab />

        {/* 로딩 */}
        {isLoading && (
          <div className="rounded-xl border border-outline bg-white/80 p-6 text-text-2">
            불러오는 중...
          </div>
        )}

        {/* 에러 */}
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

        {/* List */}
        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {content.map((t) => (
                <MineCard key={t.storytrackId} track={t} />
              ))}

              {content.length === 0 && (
                <div className="col-span-1 md:col-span-3 lg:col-span-4 text-center text-text-3 py-12">
                  생성한 트랙이 없어요.
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            <Pagination
              page={page}
              size={size}
              totalElements={totalElements}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </>
  );
}
