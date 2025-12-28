"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import StoryHeader from "../common/StoryHeader";
import StoryMenuTab from "../common/StoryMenuTab";
import JoinedCard from "./JoinedCard";

import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";

export default function JoinedTrackPage() {
  const [page, setPage] = useState(0);
  const size = 10;

  const { data: tracks, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["joinedStoryTrack", page, size],
    queryFn: async ({ signal }) => {
      return await storyTrackApi.joinedList({ page, size }, signal);
    },
  });

  const pageInfo = tracks?.data;
  const content: StoryTrackJoinedItem[] = (pageInfo?.content ?? []) as StoryTrackJoinedItem[];

  return (
    <>
      <div className="p-8 space-y-6">
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
            <div className="grid grid-cols-3 gap-6">
              {content.map((t) => (
                <JoinedCard
                  key={t.storytrackId}
                  track={t}
                />
              ))}

              {content.length === 0 && (
                <div className="col-span-3 text-center text-text-3 py-12">
                  참여한 트랙이 없어요.
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                className="px-3 py-2 rounded-xl border border-outline text-text-2 disabled:opacity-40"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                type="button"
              >
                이전
              </button>

              <span className="text-text-2">
                {page + 1} / {pageInfo?.totalPages ?? 1}
              </span>

              <button
                className="px-3 py-2 rounded-xl border border-outline text-text-2 disabled:opacity-40"
                disabled={pageInfo?.last ?? true}
                onClick={() => setPage((p) => p + 1)}
                type="button"
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
