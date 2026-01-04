"use client";

import Logo from "@/components/common/Logo";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import { distanceMeters } from "@/lib/hooks/distanceMeters";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type MemberType = "CREATOR" | "NOT_JOINED" | "PARTICIPANT" | "COMPLETED";

type TrackRouteProps = {
  myLocation: { lat: number; lng: number } | null;
  memberType?: MemberType;
  storytrackType?: TrackType;
  capsuleList?: StoryTrackPathItem[];
  completedCapsuleList?: number[];
};

export default function TrackRoute({
  myLocation,
  memberType,
  storytrackType,
  capsuleList,
  completedCapsuleList,
}: TrackRouteProps) {
  const router = useRouter();

  const params = useParams();
  const storytrackId =
    typeof params.trackId === "string" ? params.trackId : undefined;

  // CREATOR / NOT_JOINED 는 클릭 불가
  const canClick = memberType === "PARTICIPANT" || memberType === "COMPLETED";

  const {
    data: progressData,
    isError: isProgressError,
    error: progressError,
  } = useQuery({
    queryKey: ["storyTrackProgress", storytrackId],
    queryFn: async ({ signal }) => {
      return await storyTrackApi.storyTrackProgress({ storytrackId }, signal);
    },
    refetchOnMount: false,
    enabled: !!storytrackId && canClick,
  });

  if (isProgressError) {
    console.error(progressError);
    return <div>{String(progressError)}</div>;
  }

  return (
    <div className="p-4 lg:p-6 h-full flex flex-col gap-4">
      <p className="text-base lg:text-xl">경로 상세</p>

      <div className="flex gap-4 lg:min-h-0">
        <div className="w-full h-full overflow-y-auto space-y-4 pr-2">
          {canClick
            ? // PARTICIPANT / COMPLETED
              capsuleList?.map((item) => {
                const isDone = completedCapsuleList?.includes(
                  item.capsule.capsuleId
                );

                const isLockedSequential =
                  storytrackType === "SEQUENTIAL" &&
                  (progressData?.data.lastCompletedStep ?? 0) + 1 <
                    item.stepOrder;

                return (
                  <div key={item.capsule.capsuleId}>
                    {isDone ? (
                      <button
                        className="cursor-pointer w-full rounded-xl border border-green-400 p-6 flex items-start gap-4 bg-green-50"
                        onClick={() =>
                          router.push(`?id=${item.capsule.capsuleId}`)
                        }
                      >
                        <div className="flex-none w-12 h-12 rounded-full flex items-center justify-center bg-green-600 text-white">
                          <CheckCircle />
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-col items-start text-left">
                            <p className="text-lg">
                              {item.capsule.capsuleTitle}
                            </p>
                            <p className="text-sm text-text-2">
                              {item.capsule.unlock.location.address}
                            </p>
                          </div>
                        </div>
                      </button>
                    ) : isLockedSequential ? (
                      <button
                        disabled
                        className="w-full rounded-xl border border-outline p-6 flex items-start gap-4 bg-button-hover cursor-not-allowed"
                      >
                        <div className="flex-none w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
                          {item.stepOrder}
                        </div>
                        <div className="flex flex-col items-start text-left">
                          <p className="text-lg">{item.capsule.capsuleTitle}</p>
                          <p className="text-sm text-text-2">
                            {item.capsule.unlock.location.address}
                          </p>
                        </div>
                      </button>
                    ) : (
                      <button
                        className="group cursor-pointer w-full rounded-xl border border-outline p-6 flex items-center justify-between gap-4 hover:bg-button-hover"
                        onClick={() =>
                          router.push(`?id=${item.capsule.capsuleId}`)
                        }
                      >
                        <div className="flex gap-4">
                          <div className="flex-none w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
                            {storytrackType === "SEQUENTIAL" ? (
                              item.stepOrder
                            ) : (
                              <Logo className="text-white w-6 h-6" />
                            )}
                          </div>
                          <div className="flex flex-col items-start text-left">
                            <p className="text-lg">
                              {item.capsule.capsuleTitle}
                            </p>
                            <p className="text-sm text-text-2">
                              {item.capsule.unlock.location.address}
                            </p>
                          </div>
                        </div>

                        {myLocation &&
                          distanceMeters(myLocation, {
                            lat: item.capsule.unlock.location.locationLat,
                            lng: item.capsule.unlock.location.locationLng,
                          }) >= 50 && (
                            <div className="hidden group-hover:block">
                              <Lock />
                            </div>
                          )}
                      </button>
                    )}
                  </div>
                );
              })
            : // CREATOR / NOT_JOINED: 클릭/네비게이션 완전 차단
              capsuleList?.map((item) => (
                <button
                  key={item.capsule.capsuleId}
                  type="button"
                  disabled
                  className="w-full rounded-xl border border-outline p-6 flex items-start gap-4 bg-button-hover opacity-60 cursor-not-allowed"
                >
                  <div className="flex-none w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
                    {storytrackType === "SEQUENTIAL" ? (
                      item.stepOrder
                    ) : (
                      <Logo className="text-white w-6 h-6" />
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <p className="text-lg">{item.capsule.capsuleTitle}</p>
                    <p className="text-sm text-text-2">
                      {item.capsule.unlock.location.address}
                    </p>
                  </div>
                </button>
              ))}
        </div>
      </div>
    </div>
  );
}
