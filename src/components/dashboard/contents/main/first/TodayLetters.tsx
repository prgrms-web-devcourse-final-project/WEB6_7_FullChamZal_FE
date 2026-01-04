"use client";

import DivBox from "@/components/dashboard/DivBox";
import TodayLettersSkeleton from "@/components/skeleton/dashboard/home/TodayLettersSkeleton";
import { authApiClient } from "@/lib/api/auth/auth.client";
import { capsuleDashboardApi } from "@/lib/api/capsule/dashboardCapsule";
import { formatDateTime } from "@/lib/hooks/formatDateTime";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TodayLetters() {
  const router = useRouter();

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => authApiClient.me(),
  });

  const today = new Date();
  const todayText = today.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["dailyUnlocked"],
    queryFn: ({ signal }) => capsuleDashboardApi.dailyUnlocked(signal),
  });

  const list = data?.data.data ?? [];

  if (isLoading) return <TodayLettersSkeleton />;

  return (
    <>
      <div className="space-y-5">
        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl lg:text-4xl font-medium">
            안녕하세요, {me?.name}님<span className="text-primary px-1">_</span>
          </h2>
          <p className="text-text-2 text-base lg:text-lg ">
            오늘은 {todayText}, 오늘 당신을 기다리는 편지가{" "}
            <span className="text-primary font-semibold">{list.length}통</span>{" "}
            있습니다.
          </p>
        </div>
        {/* Card => 총 4개 까지 */}
        <div className=" flex gap-4 overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-2 lg:overflow-visible lg:ml-6">
          {list.length === 0 ? (
            <div className="h-20 flex flex-col justify-center">
              <p className="text-text-4">열람 예정 편지가 없습니다.</p>
            </div>
          ) : (
            list.slice(0, 4).map((l) => (
              <button
                key={l.capsuleId}
                onClick={() =>
                  router.push(`/dashboard/receive?id=${l.capsuleId}`)
                }
                className="snap-start min-w-[85%] sm:min-w-[70%] lg:min-w-0"
              >
                <DivBox className="w-full">
                  <div className="flex flex-col gap-3">
                    <div className="w-full flex items-start justify-between">
                      {/* 보낸 사람 */}
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-text-3 text-xs">보낸 사람</span>
                        <span>{l.sender}</span>
                      </div>

                      {/* 해제 조건에 따라 아이콘 변경 */}
                      <span className="p-2 rounded-md bg-sub text-sm">
                        {l.locationName === "" ? (
                          <Clock size={18} />
                        ) : (
                          <div className="flex gap-1">
                            <Clock size={18} />
                            <MapPin size={18} />
                          </div>
                        )}
                      </span>
                    </div>

                    {/* 해제 조건 */}
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-text-3 text-xs">해제 시간</span>
                      <span>{formatDateTime(l.unlockAt)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-text-3">
                      <span className="text-sm ">편지 읽기</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </DivBox>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
