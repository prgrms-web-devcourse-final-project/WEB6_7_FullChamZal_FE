"use client";

import ApiError from "@/components/common/error/ApiError";
import DivBox from "@/components/dashboard/DivBox";
import TodayLettersSkeleton from "@/components/skeleton/dashboard/home/TodayLettersSkeleton";
import { authApiClient } from "@/lib/api/auth/auth.client";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import { formatDateTime } from "@/lib/hooks/formatDateTime";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

type DailyUnlockedCapsuleItem = {
  capsuleId: number;
  sender: string;
  unlockAt: string;
  locationName: string;
};

/** UTC 파싱(판정용) */
function normalizeToUtcIso(s: string) {
  if (/[zZ]$|[+\-]\d{2}:\d{2}$/.test(s)) return s;
  return s.replace(" ", "T") + "Z";
}

function getUtcMs(isoString?: string | null) {
  if (!isoString) return null;
  const ms = new Date(normalizeToUtcIso(String(isoString))).getTime();
  return Number.isFinite(ms) ? ms : null;
}

function getDerivedUnlockType(l: DailyUnlockedCapsuleItem) {
  return l.locationName?.trim()
    ? ("TIME_AND_LOCATION" as const)
    : ("TIME" as const);
}

function getCardState(l: DailyUnlockedCapsuleItem) {
  const derivedType = getDerivedUnlockType(l);

  const unlockAtMs = getUtcMs(l.unlockAt);
  const timeOk = unlockAtMs != null ? Date.now() >= unlockAtMs : false;

  if (derivedType === "TIME") {
    return {
      derivedType,
      canNavigate: timeOk,
      hint: timeOk ? "" : "해제 시간이 되면 열 수 있어요",
    };
  }

  if (!timeOk) {
    return {
      derivedType,
      canNavigate: false,
      hint: "시간 · 장소 조건을 모두 달성해야 열 수 있어요",
    };
  }

  const loc = l.locationName?.trim()
    ? `“${l.locationName.trim()}”`
    : "지정 위치";
  return {
    derivedType,
    canNavigate: false,
    hint: `시간은 됐어요. ${loc}에 도착하면 열 수 있어요`,
  };
}

export default function TodayLetters() {
  const router = useRouter();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => authApiClient.me(),
    staleTime: 60_000,
  });

  const dailyQuery = useQuery({
    queryKey: ["dailyUnlocked"],
    queryFn: ({ signal }) => capsuleDashboardApi.dailyUnlocked(signal),
  });

  const today = new Date();
  const todayText = today.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  if (meQuery.isLoading || dailyQuery.isLoading)
    return <TodayLettersSkeleton />;

  if (meQuery.isError || dailyQuery.isError) {
    return (
      <ApiError
        title="오늘의 편지를 불러오지 못했어요."
        description="네트워크 상태를 확인하고 다시 시도해주세요."
        onRetry={() => {
          meQuery.refetch();
          dailyQuery.refetch();
        }}
      />
    );
  }

  const me = meQuery.data;
  const list: DailyUnlockedCapsuleItem[] = dailyQuery.data?.data.data ?? [];

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-4xl font-medium">
          안녕하세요, {me?.name}님<span className="text-primary px-1">_</span>
        </h2>
        <p className="text-text-2 text-base lg:text-lg">
          오늘은 {todayText}, 오늘 당신을 기다리는 편지가{" "}
          <span className="text-primary font-semibold">{list.length}통</span>{" "}
          있습니다.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-2 lg:overflow-visible lg:ml-6">
        {list.length === 0 ? (
          <div className="h-20 flex flex-col justify-center">
            <p className="text-text-4">열람 예정 편지가 없습니다.</p>
          </div>
        ) : (
          list.slice(0, 4).map((l) => {
            const { derivedType, canNavigate, hint } = getCardState(l);

            const timeText = l.unlockAt
              ? formatDateTime(l.unlockAt)
              : "시간 정보 없음";
            const locationText = l.locationName?.trim()
              ? l.locationName.trim()
              : null;

            const conditionText =
              derivedType === "TIME_AND_LOCATION" && locationText
                ? `${locationText} · ${timeText}`
                : timeText;

            return (
              <button
                key={l.capsuleId}
                type="button"
                onClick={() => {
                  if (!canNavigate) return;
                  router.push(`/dashboard/receive?id=${l.capsuleId}`);
                }}
                className={`snap-start min-w-[85%] sm:min-w-[70%] lg:min-w-0 text-left
                  ${canNavigate ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <div className="w-full p-6 border border-outline rounded-2xl">
                  <div className="flex flex-col gap-3">
                    <div className="w-full flex items-start justify-between">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-text-3 text-xs">보낸 사람</span>
                        <span>{l.sender}</span>
                      </div>

                      <span className="p-2 rounded-md bg-sub text-sm">
                        {derivedType === "TIME" ? (
                          <Clock size={18} />
                        ) : (
                          <div className="flex gap-2">
                            <Clock size={18} />
                            <MapPin size={18} />
                          </div>
                        )}
                      </span>
                    </div>

                    <div className="flex flex-col items-start gap-1">
                      <span className="text-text-3 text-xs">해제 조건</span>
                      <span className="line-clamp-2">{conditionText}</span>
                    </div>

                    {canNavigate ? (
                      <div className="flex items-center gap-1 text-text-3">
                        <span className="text-sm">편지 읽기</span>
                        <ArrowRight size={16} />
                      </div>
                    ) : (
                      <span className="text-sm text-text-4">
                        {hint || "해제 후 열람 가능"}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
