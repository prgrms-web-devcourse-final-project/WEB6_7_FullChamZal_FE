import Logo from "@/components/common/Logo";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import { useQuery } from "@tanstack/react-query";
import { Check, CheckCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type TrackRouteProps = {
  memberType?: string;
  storytrackType?: "SEQUENTIAL" | "PARALLEL";
  capsuleList?: StoryTrackPathItem[];
  completedCapsuleList?: number[];
};

export default function TrackRoute({
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
            ? capsuleList?.map((item) => (
                <>
                  {completedCapsuleList?.includes(item.capsule.capsuleId) ? (
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
                  )}
                </>
              ))
            : capsuleList?.map((item) => (
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

          {/* 순서대로 => 번호 / 순서x => 로고 */}
          {/* 순서 버전 */}
          {/* <button className="cursor-pointer w-full rounded-xl border border-outline p-6 flex items-start gap-4 hover:bg-button-hover">
            <div className="flex-none w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
              1
            </div>
            <div className="flex flex-col items-start text-left">
              <p className="text-lg">잠실 한강공원</p>
              <p className="text-sm text-text-2">
                서울특별시 송파구 올림픽로 139
              </p>
            </div>
          </button> */}

          {/* 순서x 버전 */}
          {/* <button className="cursor-pointer w-full rounded-xl border border-outline p-6 flex items-start gap-4 hover:bg-button-hover">
            <div className="flex-none w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
              <Logo className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col items-start text-left">
              <p className="text-lg">잠실 한강공원</p>
              <p className="text-sm text-text-2">
                서울특별시 송파구 올림픽로 139
              </p>
            </div>
          </button> */}

          {/* 편지 확인 버전 */}
          {/* <button className="cursor-pointer w-full rounded-xl border border-green-400 p-6 flex items-start gap-4 bg-green-50">
            <div className="flex-none w-12 h-12 rounded-full flex items-center justify-center bg-green-600 text-white">
              <CheckCircle />
            </div>
            <div className="space-y-2">
              <div className="flex flex-col items-start text-left">
                <p className="text-lg">뚝섬 한강공원</p>
                <p className="text-sm text-text-2">
                  서울특별시 광진구 강변북로 139
                </p>
              </div>
              <p className="flex gap-1 text-xs text-green-600">
                <Check size={16} />
                <span>완료: 2024. 12. 21. 오전 10:15:00</span>
              </p>
            </div>
          </button> */}

          {/* 순서 버전에서 아직 차례가 되지 않은 것들 */}
          {/* <button
            disabled
            className="cursor-pointer w-full rounded-xl border border-outline p-6 flex items-start gap-4 bg-button-hover disabled:cursor-not-allowed"
          >
            <div className="flex-none w-12 h-12 rounded-full flex items-center justify-center bg-text text-white">
              3
            </div>
            <div className="flex flex-col items-start text-left">
              <p className="text-lg">여의도 한강공원</p>
              <p className="text-sm text-text-2">
                서울특별시 영등포구 여의동로 330
              </p>
            </div>
          </button> */}
        </div>
      </div>
    </div>
  );
}
