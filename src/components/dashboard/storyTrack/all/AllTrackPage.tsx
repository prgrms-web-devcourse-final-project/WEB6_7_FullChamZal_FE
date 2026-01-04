"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import TrackCard from "./TrackCard";
import BackButton from "@/components/common/BackButton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import StorytrackCardSkeleton from "@/components/skeleton/dashboard/storytrack/StorytrackCardSkeleton";

type StatusFilter = "all" | "PARTICIPANT" | "NOT_JOINED" | "COMPLETED";
type SortOption = "newest" | "popular";

/* 입력 디바운스 */
function useDebouncedValue<T>(value: T, delay = 150) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

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

export default function AllTrackPage() {
  const size = 15;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 150);

  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");

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
    queryKey: ["allStoryTrack", size, status, sort] as const,
    queryFn: ({ pageParam = 0, signal }) =>
      storyTrackApi.allList({ page: pageParam, size }, signal),
    getNextPageParam: (lastPage) => {
      const page = lastPage.data.page ?? 0;
      const totalPages = lastPage.data.totalPages ?? 1;
      return page + 1 < totalPages ? page + 1 : undefined;
    },
    staleTime: 30_000,
    initialPageParam: 0,
  });

  /* 모든 페이지 content 합치기 */
  const allContent = useMemo(() => {
    return data?.pages.flatMap((p) => p.data.content ?? []) ?? [];
  }, [data]);

  const getTrackStatus = (s: StoryTrackItem): StatusFilter => {
    if (s.memberType === "COMPLETED") return "COMPLETED";
    if (s.memberType === "NOT_JOINED") return "NOT_JOINED";
    if (s.memberType === "PARTICIPANT") return "PARTICIPANT";
    return "all";
  };

  /* 검색 + 상태필터 + 정렬을 "로컬에서" 적용 */
  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();

    let items = allContent;

    if (q) {
      items = items.filter((t: StoryTrackItem) => {
        const text = `${t.title ?? ""} ${t.desctiption ?? ""}`.toLowerCase();
        return text.includes(q);
      });
    }

    if (status !== "all") {
      items = items.filter((t: StoryTrackItem) => getTrackStatus(t) === status);
    }

    const sorted = [...items].sort((a: StoryTrackItem, b: StoryTrackItem) => {
      if (sort === "popular") {
        const ap = Number(a.totalMemberCount ?? 0);
        const bp = Number(b.totalMemberCount ?? 0);
        return bp - ap;
      }
      const at = new Date(a.createdAt ?? 0).getTime();
      const bt = new Date(b.createdAt ?? 0).getTime();
      return bt - at;
    });

    return sorted;
  }, [allContent, debouncedSearch, status, sort]);

  /* 검색 중에는 무한 로딩 멈추기 */
  const infiniteEnabled =
    Boolean(hasNextPage) &&
    !isFetchingNextPage &&
    debouncedSearch.trim() === "";

  /* 무한스크롤 트리거 */
  useInfiniteScroll(loadMoreRef, () => fetchNextPage(), infiniteEnabled);

  /* (옵션) 필터/정렬 바뀌면 스크롤 상단으로 */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [status, sort]);

  const emptyMessage = useMemo(() => {
    if (filtered.length !== 0) return null;

    switch (status) {
      case "PARTICIPANT":
        return "참여 중인 트랙이 없습니다.";
      case "NOT_JOINED":
        return "미참여 중인 트랙이 없습니다.";
      case "COMPLETED":
        return "완료한 트랙이 없습니다.";
      default:
        return "조건에 맞는 트랙이 없습니다.";
    }
  }, [filtered.length, status]);

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
          placeholder="스토리트랙 제목이나 소개 내용으로 검색..."
          className="w-full p-2.5 pl-10 md:p-4 md:pl-12 bg-white/80 border border-outline rounded-xl outline-none focus:border-primary-2"
        />
      </div>

      {/* 필터 영역 */}
      <div className="flex flex-wrap items-center gap-2 text-xs md:text-base">
        <div className="flex gap-2">
          <button
            onClick={() => setStatus("all")}
            className={`cursor-pointer px-3 py-2 rounded-xl border ${
              status === "all"
                ? "border-primary text-primary"
                : "border-outline text-text-2 hover:bg-button-hover"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setStatus("PARTICIPANT")}
            className={`cursor-pointer px-3 py-2 rounded-xl border ${
              status === "PARTICIPANT"
                ? "border-primary text-primary"
                : "border-outline text-text-2 hover:bg-button-hover"
            }`}
          >
            참여중
          </button>
          <button
            onClick={() => setStatus("NOT_JOINED")}
            className={`cursor-pointer px-3 py-2 rounded-xl border ${
              status === "NOT_JOINED"
                ? "border-primary text-primary"
                : "border-outline text-text-2 hover:bg-button-hover"
            }`}
          >
            미참여
          </button>
          <button
            onClick={() => setStatus("COMPLETED")}
            className={`cursor-pointer px-3 py-2 rounded-xl border ${
              status === "COMPLETED"
                ? "border-primary text-primary"
                : "border-outline text-text-2 hover:bg-button-hover"
            }`}
          >
            완료
          </button>
        </div>

        <div className="flex-1" />

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="cursor-pointer appearance-none py-2 pl-4 pr-10 rounded-xl border border-outline bg-white/80 text-text-2 outline-none transition hover:bg-white hover:border-primary-2 focus:border-primary"
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
          }}
          className="cursor-pointer px-3 py-2 rounded-xl border border-outline text-text-2 hover:bg-button-hover"
        >
          초기화
        </button>
      </div>

      {/* 에러 */}
      {isError && (
        <div className="rounded-xl border border-outline bg-white/80 p-6">
          <p className="text-primary font-medium">불러오기에 실패했어요.</p>
          <pre className="mt-3 text-xs whitespace-pre-wrap text-text-3">
            {error instanceof Error ? error.message : String(error)}
          </pre>
          <button
            className="cursor-pointer mt-4 px-3 py-2 rounded-xl border border-outline text-text-2 hover:bg-white"
            onClick={() => refetch()}
            type="button"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 로딩 */}
      {isLoading && !isError && <StorytrackCardSkeleton count={4} />}

      {/* 결과 */}
      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((t: StoryTrackItem) => (
              <TrackCard key={t.storytrackId} track={t} />
            ))}

            {emptyMessage && (
              <div className="col-span-full text-center text-text-3 py-12">
                {emptyMessage}
              </div>
            )}
          </div>

          {/* 무한스크롤 */}
          <div ref={loadMoreRef} className="h-10" />

          {isFetchingNextPage && (
            <div className="rounded-xl border border-outline bg-white/80 p-4 text-center text-text-2">
              더 불러오는 중...
            </div>
          )}

          {!hasNextPage && filtered.length > 0 && (
            <div className="text-center text-xs md:text-sm text-text-3 py-4">
              마지막 트랙입니다.
            </div>
          )}
        </>
      )}
    </div>
  );
}
