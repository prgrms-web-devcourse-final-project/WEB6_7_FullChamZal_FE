import Logo from "@/components/common/Logo";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import { distanceMeters } from "@/lib/hooks/distanceMeters";
import { useQuery } from "@tanstack/react-query";
import { Check, CheckCircle, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type TrackRouteProps = {
  myLocation: { lat: number; lng: number } | null;
  memberType?: string;
  storytrackType?: "SEQUENTIAL" | "PARALLEL";
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

  //스토리트랙 id
  const params = useParams();
  const storytrackId =
    typeof params.trackId === "string" ? params.trackId : undefined;

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
    refetchOnMount: false,
    enabled:
      !!storytrackId &&
      (memberType === "PARTICIPANT" || memberType === "COMPLETED"),
  });

  if (isProgressError) {
    console.error(progressError);
    return <div>{String(progressError)}</div>;
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <p className="text-base lg:text-xl">경로 상세</p>

      <div className="flex gap-4 lg:min-h-0">
        <div className="w-full h-full overflow-y-auto space-y-4 pr-2">
          {memberType === "PARTICIPANT" || memberType === "COMPLETED"
            ? //열람, 잠금 여부에 따른 style을 적용한 item
              //해당 스토리트랙에 참여한 사용자와 완료한 사용자에게 보여짐.
              capsuleList?.map((item) => (
                <>
                  {completedCapsuleList?.includes(item.capsule.capsuleId) ? (
                    // 완료한 item style
                    <button
                      key={item.capsule.capsuleId}
                      className="cursor-pointer w-full rounded-xl border border-green-400 p-6 flex items-start gap-4 bg-green-50"
                      onClick={() => {
                        router.push(`?id=${item.capsule.capsuleId}`);
                      }}
                    >
                      <div className="flex-none w-12 h-12 rounded-full flex items-center justify-center bg-green-600 text-white">
                        <CheckCircle />
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-col items-start text-left">
                          <p className="text-lg">{item.capsule.capsuleTitle}</p>
                          <p className="text-sm text-text-2">
                            {item.capsule.unlock.location.address}
                          </p>
                        </div>
                        {/* <p className="flex gap-1 text-xs text-green-600">
                          <Check size={16} />
                          <span>완료: 2024. 12. 21. 오전 10:15:00</span>
                        </p> */}
                      </div>
                    </button>
                  ) : (progressData?.data.lastCompletedStep ?? 0) + 1 <
                      item.stepOrder && storytrackType === "SEQUENTIAL" ? (
                    // 열람 불가능한 item style
                    <button
                      disabled
                      className="cursor-pointer w-full rounded-xl border border-outline p-6 flex items-start gap-4 bg-button-hover disabled:cursor-not-allowed"
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
                    // 기본 item style
                    <button
                      key={item.capsule.capsuleId}
                      className="group cursor-pointer w-full rounded-xl border border-outline p-6 flex items-center justify-between gap-4 hover:bg-button-hover"
                      onClick={() => {
                        router.push(`?id=${item.capsule.capsuleId}`);
                      }}
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
                          <p className="text-lg">{item.capsule.capsuleTitle}</p>
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
                </>
              ))
            : //열람, 잠금 여부에 따른 style을 적용하지 않은 item
              //해당 스토리트랙에 참여하지 않은 사용자와 스토리트랙 생성자에게 보여짐.
              capsuleList?.map((item) => (
                <button
                  key={item.capsule.capsuleId}
                  className="cursor-pointer w-full rounded-xl border border-outline p-6 flex items-start gap-4 hover:bg-button-hover"
                  onClick={() => {
                    router.push(`?id=${item.capsule.capsuleId}`);
                  }}
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
