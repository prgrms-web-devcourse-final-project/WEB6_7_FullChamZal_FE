/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import DivBox from "../../../DivBox";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import { useQuery } from "@tanstack/react-query";
import YearlyLetterSkeleton from "@/components/ui/skeleton/dashboard/home/YearlyLetterSkeleton";
import ApiError from "@/components/common/error/ApiError";

type YearLettersItem = {
  name: string;
  send: number;
  receive: number;
};

export default function YearlyLetterOverview() {
  const nowYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(nowYear);

  const query = useQuery({
    queryKey: ["yearLetters", year],
    queryFn: ({ signal }) => capsuleDashboardApi.yearLetters(year, signal),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
    retry: 1,
  });

  const { data: yearLetters, isLoading, isError } = query;

  const yearData: YearLettersItem[] = yearLetters?.data.data ?? [];

  // 그 해 월별 집계 합산 => 그 해 보낸/받은 편지 수
  const { sendCount, receiveCount, total } = useMemo(() => {
    let sendCount = 0;
    let receiveCount = 0;

    for (const cur of yearData) {
      sendCount += cur?.send ?? 0;
      receiveCount += cur?.receive ?? 0;
    }

    return { sendCount, receiveCount, total: sendCount + receiveCount };
  }, [yearData]);

  const activityBadge = useMemo(() => {
    if (total >= 50)
      return { label: "매우 활발", tone: "text-emerald-600", Icon: TrendingUp };
    if (total >= 20)
      return { label: "활발", tone: "text-lime-600", Icon: TrendingUp };
    if (total >= 5)
      return { label: "보통", tone: "text-sky-600", Icon: TrendingUp };
    return { label: "조용", tone: "text-text-3", Icon: TrendingUp };
  }, [total]);

  // 지금보다 뒤에 연도는 보지 못하게
  const canGoNext = year < nowYear;
  const canGoPrev = true;

  // 로딩
  if (isLoading && !yearLetters) return <YearlyLetterSkeleton />;

  // 에러
  if (isError) {
    return (
      <>
        <div className="flex items-center justify-center w-full border p-6 border-outline rounded-2xl lg:flex-2">
          <ApiError
            title="연간 활동 데이터를 불러오지 못했어요."
            description="네트워크 상태를 확인하고 다시 시도해주세요."
            onRetry={() => query.refetch()}
          />
        </div>
      </>
    );
  }

  const BadgeIcon = activityBadge.Icon;

  return (
    <DivBox className="lg:flex-2 space-y-6 cursor-auto">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-base md:text-lg">{year}년 활동</p>
          <p className="text-sm md:text-base text-text-3">편지 주고받기 현황</p>
        </div>

        <div className="flex items-center gap-4">
          {/* 연도 이전/다음 */}
          <div className="flex items-center gap-1 rounded-full border border-outline bg-bg p-1">
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={() => {
                if (!canGoPrev) return;
                setYear((y) => y - 1);
              }}
              className={[
                "w-6 h-6 md:h-8 md:w-8 grid place-items-center rounded-full transition",
                canGoPrev
                  ? "cursor-pointer hover:bg-button-hover text-text"
                  : "opacity-40 cursor-not-allowed",
              ].join(" ")}
              aria-label="이전 연도"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="px-1 md:px-2 text-xs md:text-sm">{year}</div>

            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => {
                if (!canGoNext) return;
                setYear((y) => y + 1);
              }}
              className={[
                "w-6 h-6 md:h-8 md:w-8 grid place-items-center rounded-full transition",
                canGoNext
                  ? "cursor-pointer hover:bg-button-hover text-text"
                  : "opacity-40 cursor-not-allowed",
              ].join(" ")}
              aria-label="다음 연도"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* 활동 뱃지 */}
          <div
            className={`${activityBadge.tone} flex-none flex items-center gap-1`}
          >
            <BadgeIcon size={16} />
            <span className="text-sm">{activityBadge.label}</span>
          </div>
        </div>
      </div>

      {/* 카운트 */}
      <div className="flex gap-4">
        <div className="w-full px-4 py-3 bg-sub rounded-[10px] space-y-2">
          <p className="text-sm">보낸 편지</p>
          <p className="text-2xl">{sendCount}</p>
        </div>
        <div className="w-full px-4 py-3 bg-activeBg/50 rounded-[10px] space-y-2">
          <p className="text-sm">받은 편지</p>
          <p className="text-2xl">{receiveCount}</p>
        </div>
      </div>

      {/* 차트 */}
      <div className="h-60 md:h-75 lg:h-80 select-none outline-none [&_*:focus]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={yearData}
            margin={{ top: 20, right: 20, bottom: 20, left: -30 }}
          >
            <defs>
              <linearGradient id="sendArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D6DAE1" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#D6DAE1" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="receiveArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFBCB1" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#FFBCB1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="send"
              stroke="#b9bec7"
              strokeWidth={2}
              fill="url(#sendArea)"
              name="보낸 편지"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="receive"
              stroke="#ffa294"
              strokeWidth={2}
              fill="url(#receiveArea)"
              name="받은 편지"
              isAnimationActive={false}
            />

            <CartesianGrid stroke="#E7E5E4" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Legend align="right" />
            <Tooltip />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </DivBox>
  );
}
