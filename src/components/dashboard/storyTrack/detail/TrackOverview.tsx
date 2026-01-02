"use client";

import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ListOrdered,
  Pencil,
  Play,
  Route,
  Shuffle,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function TrackOverview() {
  const params = useParams();
  const storytrackId =
    typeof params.trackId === "string" ? params.trackId : undefined;
  const queryClient = useQueryClient();
  const [page] = useState(0);
  const [size] = useState(100);

  // 스토리트랙 상세 조회
  const {
    data: trackData,
    isError,
    error,
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

  // 참여하기
  const joinMutation = useMutation({
    mutationFn: () =>
      storyTrackApi.participantStorytrack({
        storytrackId: Number(storytrackId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["storyTrackDetail", storytrackId],
      });
      queryClient.removeQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "allStoryTrack",
      });
      queryClient.removeQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "joinedStoryTrack",
      });
    },
  });

  // 참여취소
  const cancelMutation = useMutation({
    mutationFn: () =>
      storyTrackApi.deleteParticipantStorytrack({
        storytrackId: Number(storytrackId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["storyTrackDetail", storytrackId],
      });
      queryClient.removeQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "allStoryTrack",
      });
      queryClient.removeQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "joinedStoryTrack",
      });
    },
  });

  const serverMemberType = trackData?.data.memberType;
  const memberType: MemberType | undefined = joinMutation.isPending
    ? "PARTICIPANT"
    : cancelMutation.isPending
    ? "NOT_JOINED"
    : serverMemberType;

  const isPending = joinMutation.isPending || cancelMutation.isPending;

  if (isError) {
    console.error(error);
    return <div>{String(error)}</div>;
  }
  return (
    <>
      <div className="p-6 flex flex-col h-full">
        <div className="flex flex-col justify-between h-full gap-4">
          <div className="space-y-6">
            <div className="space-y-4">
              {/* 제목 */}
              <div className="text-xl">{trackData?.data.title}</div>
              {/* 요약 */}
              <div className="flex gap-2">
                <div className="bg-primary-5/60 border-2 border-primary-4 rounded-full px-2 py-1 flex items-center gap-1 text-primary-2">
                  {trackData?.data.storytrackType === "SEQUENTIAL" ? (
                    <>
                      <ListOrdered size={16} />
                      <span className="text-sm">순서대로</span>
                    </>
                  ) : (
                    <>
                      <Shuffle size={18} />
                      <span className="text-sm">순서무관</span>
                    </>
                  )}
                </div>

                <div className="bg-button-hover border-2 border-outline rounded-full px-2 flex items-center gap-1 text-text-2">
                  <Route size={16} />
                  <span className="text-sm">
                    {trackData?.data.totalSteps}개 장소
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-text-3">
                <Users size={16} />
                <span className="text-sm">
                  {trackData?.data.totalParticipant}명 참여 중
                </span>
              </div>
            </div>

            {/* 구분선 */}
            <div className="w-full h-px bg-outline"></div>

            {/* 소개 */}
            <div className="space-y-4">
              {/* 소개 내용 */}
              <div className="text-sm space-y-2">
                <p>트랙 소개</p>
                <p className="text-text-3 break-keep">
                  {/* api 속성 추가 필요 */}
                  {trackData?.data.descripton}
                </p>
              </div>

              {/* 작성자 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                  {trackData?.data.createrNickname.slice(0, 1)}
                </div>
                <div className="flex flex-col">
                  {/* <span className="text-sm text-text-4">만든 사람</span> */}
                  <span>{trackData?.data.createrNickname}</span>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="w-full h-px bg-outline"></div>

            {/* 생성일 */}
            <span className="text-text-3 text-sm">
              생성일: {trackData?.data.createdAt.slice(0, 10)}
            </span>
          </div>

          {/* 버튼 */}
          <div className="w-full">
            {memberType === "CREATOR" ? (
              <div className="grid grid-cols-2 gap-2">
                <button className="cursor-pointer justify-center bg-text-2 hover:bg-text-3 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                  <Pencil />
                  수정
                </button>
                <button className="cursor-pointer justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                  <Trash2 />
                  삭제
                </button>
              </div>
            ) : memberType === "NOT_JOINED" ? (
              <button
                className="w-full flex items-center justify-center gap-2 cursor-pointer bg-primary hover:bg-primary-3 text-white px-4 py-3 rounded-xl"
                disabled={isPending}
                onClick={() => {
                  joinMutation.mutate();
                }}
              >
                <Play />
                <span>{isPending ? "처리중..." : "참여하기"}</span>
              </button>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-2 cursor-pointer bg-primary hover:bg-primary-3 text-white px-4 py-3 rounded-xl"
                disabled={isPending}
                onClick={() => {
                  cancelMutation.mutate();
                }}
              >
                <X />
                <span>{isPending ? "처리중..." : "참여 취소"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
