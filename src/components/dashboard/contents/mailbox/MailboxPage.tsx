"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import DivBox from "../../DivBox";
import EnvelopeCard from "./EnvelopeCard";
import { Bookmark, Inbox, Send } from "lucide-react";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import MailboxSkeleton from "@/components/skeleton/MailboxSkeleton";
import { bookmarkApi } from "@/lib/api/dashboard/bookmark";

function useIntersection(onIntersect: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onIntersect();
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [enabled, onIntersect]);

  return ref;
}

// ✅ EnvelopeCard가 기대하는 capsule 형태로 매핑 (필드명은 네 EnvelopeCard에 맞춰 조정 가능)
function mapBookmarkToCapsule(b: BookmarkItem) {
  return {
    capsuleId: b.capsuleId,
    title: b.title,
    contentPreview: b.contentPreview,
    senderNickname: b.sender,
    // 북마크 시간이라도 카드에 표시하고 싶으면 createdAt처럼 넣기
    createdAt: b.bookmarkedAt,
    visibility: b.visibility,
    isViewed: b.isViewed,
    bookmarkId: b.bookmarkId,
  };
}

export default function MailboxPage({
  type,
}: {
  type: "send" | "receive" | "bookmark";
}) {
  const config = {
    send: {
      title: "보낸 편지",
      icon: <Send />,
    },
    receive: {
      title: "받은 편지",
      icon: <Inbox />,
    },
    bookmark: {
      title: "저장한 편지",
      icon: <Bookmark />,
    },
  }[type];

  const isBookmark = type === "bookmark";

  // ---------------- send/receive (기존) ----------------
  const sendReceiveQuery = useQuery({
    queryKey: ["capsuleDashboard", type],
    queryFn: ({ signal }) => {
      if (type === "send") return capsuleDashboardApi.sendDashboard(signal);
      if (type === "receive")
        return capsuleDashboardApi.receiveDashboard(signal);
      return Promise.resolve([] as any[]);
    },
    enabled: !isBookmark,
  });

  // ---------------- bookmark (무한스크롤) ----------------
  const pageSize = 24;

  const bookmarkQuery = useInfiniteQuery({
    queryKey: ["bookmarks", "infinite", pageSize],
    enabled: isBookmark,
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      bookmarkApi.list(
        { page: pageParam, size: pageSize, sort: ["bookmarkedAt,desc"] },
        signal
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
  });

  const bookmarkItems = useMemo(() => {
    return bookmarkQuery.data?.pages.flatMap((p) => p.content) ?? [];
  }, [bookmarkQuery.data]);

  const bookmarkCapsules = useMemo(() => {
    return bookmarkItems.map(mapBookmarkToCapsule);
  }, [bookmarkItems]);

  const totalCount = isBookmark
    ? bookmarkQuery.data?.pages?.[0]?.totalElements ?? bookmarkCapsules.length
    : sendReceiveQuery.data?.length ?? 0;

  const sentinelRef = useIntersection(() => {
    if (!bookmarkQuery.hasNextPage || bookmarkQuery.isFetchingNextPage) return;
    bookmarkQuery.fetchNextPage();
  }, isBookmark && Boolean(bookmarkQuery.hasNextPage));

  // 통합 로딩/에러/데이터
  const isLoading = isBookmark
    ? bookmarkQuery.isLoading
    : sendReceiveQuery.isLoading;
  const isError = isBookmark ? bookmarkQuery.isError : !!sendReceiveQuery.error;
  const data = isBookmark ? bookmarkCapsules : sendReceiveQuery.data ?? [];
  const empty = !isLoading && (data?.length ?? 0) === 0;

  if (isLoading) return <MailboxSkeleton />;
  if (isError) return <div>에러 발생</div>;

  return (
    <section className="flex-1 w-full">
      <div className="p-8">
        <DivBox className="cursor-auto hover:bg-white space-y-12">
          <div className="flex items-center gap-4">
            <div className="text-primary">{config.icon}</div>
            <div>
              <p className="text-lg">
                {config.title}
                <span className="text-primary px-1">_</span>
              </p>
              <p className="text-sm text-text-3">
                <span className="text-primary font-semibold">
                  {totalCount}통
                </span>
                의 편지
                {isBookmark && bookmarkQuery.isFetching ? (
                  <span className="ml-2 text-xs text-text-3">
                    불러오는 중...
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            {empty ? (
              <p>
                {isBookmark ? "저장한 편지가 없습니다" : "받은 편지가 없습니다"}
              </p>
            ) : (
              <>
                {data.map((capsule: any) => (
                  <EnvelopeCard
                    key={capsule.capsuleId}
                    capsule={capsule}
                    type={type}
                  />
                ))}

                {/* 북마크 무한스크롤 트리거 */}
                {isBookmark ? (
                  <div className="w-full">
                    <div ref={sentinelRef} className="h-8" />
                    {bookmarkQuery.isFetchingNextPage ? (
                      <div className="text-center text-xs text-text-3 py-4">
                        더 불러오는 중...
                      </div>
                    ) : null}
                    {!bookmarkQuery.hasNextPage ? (
                      <div className="text-center text-xs text-text-3 py-4">
                        마지막입니다.
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </DivBox>
      </div>
    </section>
  );
}
