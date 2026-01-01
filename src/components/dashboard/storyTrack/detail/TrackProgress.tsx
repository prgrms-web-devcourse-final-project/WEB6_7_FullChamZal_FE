"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Flag } from "lucide-react";
import { useParams } from "next/navigation";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import { useQuery } from "@tanstack/react-query";

export default function TrackProgress() {
  const [collapsed, setCollapsed] = useState(true);

  const params = useParams();
  const storytrackId =
    typeof params.trackId === "string" ? params.trackId : undefined;
  const [page] = useState(0);
  const [size] = useState(100);

  // 스토리트랙 상세 조회
  const {
    data: detailData,
    isError: isDetailError,
    error: detailError,
  } = useQuery({
    queryKey: ["storyTrackDetail", storytrackId],
    queryFn: async ({ signal }) => {
      return await storyTrackApi.storyTrackDetail(
        { storytrackId, page, size },
        signal
      );
    },
    enabled: !!storytrackId,
  });

  // 스토리트랙 진행 상세 조회
  const {
    data: progressData,
    isError: isProgressError,
    error: progressError,
  } = useQuery({
    queryKey: ["storyTrackProgress", storytrackId],
    queryFn: async ({ signal }) => {
      return await storyTrackApi.storyTrackProgress({ storytrackId }, signal);
    },
    enabled: !!storytrackId,
  });

  const completed = progressData?.data.completedSteps;
  const total = detailData?.data.totalSteps;
  const percent =
    typeof completed === "number" && typeof total === "number" && total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  const lastCompletedCapsule =
    detailData?.data.paths.content[
      progressData ? progressData?.data.lastCompletedStep : 0
    ];

  if (isDetailError || isProgressError) {
    return (
      <div>
        {progressError
          ? "진행 상세 조회 API 에러: " + String(progressError)
          : "" + detailError
          ? "스토리트랙 상세 조회 API 에러: " + String(detailError)
          : ""}
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className={`p-4 lg:p-6  border-outline ${
          collapsed ? "border-none" : "border-b"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex-none text-xl flex items-center gap-2">
            <span className="text-sm md:text-base">진행 상황</span>
            <span className="text-xs md:text-sm text-primary-2">
              {percent}% 완료
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-28 h-1.5 bg-outline rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-2"
                style={{ width: `${percent}%` }}
              />
            </div>

            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="cursor-pointer p-1 rounded-lg hover:bg-outline/40"
              aria-expanded={!collapsed}
              aria-label={collapsed ? "펼치기" : "접기"}
            >
              {collapsed ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Body (collapsible) */}
      <div
        className={[
          "grid transition-all duration-200 ease-out",
          collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
        ].join(" ")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-4 p-6">
            {/* 경로 */}
            <div className="flex gap-4">
              <div className="flex-1 border border-outline rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs text-text-3">완료</span>
                <span className="text-xl">{completed ?? 0}</span>
              </div>
              <div className="flex-1 border border-outline rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs text-text-3">남은 장소</span>
                <span className="text-xl">
                  {typeof total === "number" ? total - (completed ?? 0) : "-"}
                </span>
              </div>
              <div className="flex-1 border border-outline rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs text-text-3">전체 장소</span>
                <span className="text-xl">{total}</span>
              </div>
            </div>

            {/* 다음 목적지 */}
            <div className="w-full border border-outline rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Flag size={20} className="text-primary" />
                <span>다음 목적지</span>
              </div>
              {detailData?.data.memberType === "COMPLETED" ? (
                <div className="space-y-1">
                  <p className="text-sm text-text-3">
                    모든 편지를 열람했습니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-lg">
                    {lastCompletedCapsule?.capsule.capsuleTitle}
                  </p>
                  <p className="text-sm text-text-3">
                    {lastCompletedCapsule?.capsule.unlock.location.address}
                  </p>
                </div>
              )}
            </div>

            {/* 시작일 / 최근 방문 */}
            <div className="w-full border border-outline rounded-xl p-4 flex">
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-text-3 text-sm">시작 날짜</span>
                <span>{progressData?.data.createdAt.slice(0, 10)}</span>
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-text-3 text-sm">완료 날짜</span>
                <span>
                  {progressData?.data.completedAt
                    ? progressData?.data.completedAt.slice(0, 10)
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
