"use client";

import { useEffect, useMemo, useRef } from "react";
import StoryHeader from "../common/StoryHeader";
import StoryMenuTab from "../common/StoryMenuTab";
import MineCard from "./MineCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";

/* 무한스크롤 */
function useInfiniteScroll(
  ref: React.RefObject<Element | null>,
  onLoadMore: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "200px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref, onLoadMore, enabled]);
}

export default function MineTrackPage() {
  const size = 15;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["joinedStoryTrack", size] as const,
    queryFn: ({ pageParam = 0, signal }) =>
      storyTrackApi.mineList({ page: pageParam, size }, signal),
    getNextPageParam: (lastPage) => {
      const page = lastPage.data.page ?? 0;
      const totalPages = lastPage.data.totalPages ?? 1;
      return page + 1 < totalPages ? page + 1 : undefined;
    },
    staleTime: 30_000,
    initialPageParam: 0,
  });

  const content: StoryTrackJoinedItem[] = useMemo(() => {
    return (data?.pages.flatMap((p) => p.data.content ?? []) ??
      []) as StoryTrackJoinedItem[];
  }, [data]);

  const infiniteEnabled = Boolean(hasNextPage) && !isFetchingNextPage;

  useInfiniteScroll(loadMoreRef, () => fetchNextPage(), infiniteEnabled);

  return (
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

          {/* 무한스크롤 sentinel */}
          <div ref={loadMoreRef} className="h-10" />

          {isFetchingNextPage && (
            <div className="rounded-xl border border-outline bg-white/80 p-4 text-center text-text-2">
              더 불러오는 중...
            </div>
          )}

          {!hasNextPage && content.length > 0 && (
            <div className="text-center text-xs md:text-sm text-text-3 py-4">
              마지막 트랙입니다.
            </div>
          )}
        </>
      )}
    </div>
  );
}
