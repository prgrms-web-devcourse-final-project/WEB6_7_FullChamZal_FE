/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import DivBox from "../../DivBox";
import EnvelopeCard from "./EnvelopeCard";
import { Bookmark, Inbox, Send } from "lucide-react";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import MailboxSkeleton from "@/components/skeleton/MailboxSkeleton";

type LatLng = { lat: number; lng: number };

function useCurrentPositionOnce(enabled: boolean) {
  const [pos, setPos] = useState<LatLng | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!navigator.geolocation) {
      setPos(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setPos(null),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 30_000 }
    );
  }, [enabled]);

  return pos;
}

function useInfiniteScrollTrigger(
  enabled: boolean,
  onIntersect: () => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onIntersect();
    }, options);

    io.observe(el);
    return () => io.disconnect();
  }, [enabled, onIntersect, options]);

  return ref;
}

export default function MailboxPage({
  type,
}: {
  type: "send" | "receive" | "bookmark";
}) {
  const config = {
    send: { title: "보낸 편지", icon: <Send /> },
    receive: { title: "받은 편지", icon: <Inbox /> },
    bookmark: { title: "소중한 편지", icon: <Bookmark /> },
  }[type];

  const isBookmark = type === "bookmark";
  const currentPos = useCurrentPositionOnce(type !== "send");

  const size = 20;

  // 1) send/receive
  const sendReceiveInf = useInfiniteQuery({
    enabled: !isBookmark,
    queryKey: ["capsuleDashboard", type, "infinite", size],
    initialPageParam: 0,
    queryFn: ({ signal, pageParam }) => {
      const page = pageParam as number;

      if (type === "send") {
        return capsuleDashboardApi.sendDashboard({ page, size }, signal);
      }
      // receive
      return capsuleDashboardApi.receiveDashboard({ page, size }, signal);
    },
    getNextPageParam: (lastPage) => {
      const d = lastPage.data;
      if (d.last) return undefined;
      return d.number + 1;
    },
  });

  // 2) bookmark
  const bookmarkInf = useInfiniteQuery({
    enabled: isBookmark,
    queryKey: ["bookmarks", "infinite", size],
    initialPageParam: 0,
    queryFn: ({ signal, pageParam }) => {
      const page = pageParam as number;
      return capsuleDashboardApi.bookmarks(
        { page, size, sort: ["bookmarkedAt,desc"] },
        signal
      );
    },
    getNextPageParam: (lastPage: BookmarkPageResponse) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
  });

  // 공통 선택
  const active = isBookmark ? bookmarkInf : sendReceiveInf;

  const isLoading = active.isLoading;
  const error = active.error;

  const { list, totalCount } = useMemo(() => {
    if (!active.data)
      return { list: [] as CapsuleDashboardItem[], totalCount: 0 };

    if (isBookmark) {
      const pages = active.data.pages as BookmarkPageResponse[];

      const adapted = pages.flatMap((p) =>
        p.content.map((b) => ({
          capsuleId: b.capsuleId,
          sender: b.sender,
          title: b.title,
          content: b.contentPreview,
          createAt: b.bookmarkedAt,
          viewStatus: b.isViewed,
        }))
      );

      const first = pages[0];
      return {
        list: adapted,
        totalCount: first?.totalElements ?? adapted.length,
      };
    }

    const pages = active.data.pages as PageResponse<CapsuleDashboardItem>[];
    const merged = pages.flatMap((p) => p.data.content);

    const first = pages[0];
    return {
      list: merged,
      totalCount: first?.data.totalElements ?? merged.length,
    };
  }, [active.data, isBookmark]);

  // 바닥 감지 → 다음 페이지 로드
  const sentinelRef = useInfiniteScrollTrigger(
    Boolean(active.hasNextPage) && !active.isFetchingNextPage,
    () => active.fetchNextPage(),
    { rootMargin: "200px" } // 바닥 200px 전에 미리 로딩
  );

  if (isLoading) return <MailboxSkeleton />;
  if (error) {
    console.error("MailboxPage query error:", error);
    return <div>에러 발생</div>;
  }

  return (
    <section className="flex-1 w-full">
      <div className="p-4 lg:p-8">
        <DivBox className="cursor-auto space-y-4 lg:space-y-12">
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
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex-wrap gap-8">
            {!list.length ? (
              <p className="text-text-3">
                {isBookmark ? "북마크한 편지가 없습니다" : "편지가 없습니다"}
              </p>
            ) : (
              <>
                {list.map((capsule) => (
                  <EnvelopeCard
                    key={capsule.capsuleId}
                    capsule={capsule}
                    type={type}
                    currentPos={currentPos}
                  />
                ))}

                {/* 무한스크롤 트리거 */}
                <div ref={sentinelRef} className="w-full h-8" />

                {/* 다음 페이지 로딩 표시 */}
                {active.isFetchingNextPage && (
                  <div className="w-full text-center text-sm text-text-3">
                    더 불러오는 중...
                  </div>
                )}
              </>
            )}
          </div>
          {/* 더 이상 없을 때 */}
          {!active.hasNextPage && list.length > 0 && (
            <div className="w-full text-center text-sm text-text-3">
              마지막 편지입니다.
            </div>
          )}
        </DivBox>
      </div>
    </section>
  );
}
