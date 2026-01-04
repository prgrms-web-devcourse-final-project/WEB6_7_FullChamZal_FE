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
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import toast from "react-hot-toast";

export default function TrackOverview() {
  const router = useRouter();
  const params = useParams();

  const storytrackId =
    typeof params.trackId === "string" ? params.trackId : undefined;

  const queryClient = useQueryClient();
  const [page] = useState(0);
  const [size] = useState(100);

  // ConfirmModal open state
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
      toast.success("참여하기가 완료되었습니다!", {
        style: { borderColor: "#57b970" },
      });
    },
    onError: () => {
      toast.error("참여하기를 실패했습니다.");
    },
  });

  // 참여취소
  const cancelMutation = useMutation({
    mutationFn: () =>
      storyTrackApi.deleteParticipantStorytrack({
        storytrackId: Number(storytrackId),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["storyTrackDetail", storytrackId],
      });
      await queryClient.removeQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "allStoryTrack",
      });
      await queryClient.removeQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "joinedStoryTrack",
      });
      toast.success("참여취소가 완료되었습니다!", {
        style: { borderColor: "#57b970" },
      });

      router.push("/dashboard/storyTrack/joined");
      router.refresh();
    },
    onError: () => {
      toast.error("참여취소를 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!storytrackId) throw new Error("storytrackId가 없습니다.");
      return storyTrackApi.deleteStoryTrack({
        storytrackId: Number(storytrackId),
      });
    },
    onSuccess: () => {
      // 상세 캐시 제거
      queryClient.removeQueries({
        queryKey: ["storyTrackDetail", storytrackId],
      });

      // 목록 캐시 제거/갱신 (프로젝트에서 쓰는 키 그대로)
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
      queryClient.removeQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "mineStoryTrack",
      });

      router.replace("/dashboard/storyTrack/mine");
      router.refresh();
    },
  });

  const serverMemberType = trackData?.data.memberType;
  const memberType: MemberType | undefined = joinMutation.isPending
    ? "PARTICIPANT"
    : cancelMutation.isPending
    ? "NOT_JOINED"
    : serverMemberType;

  const isPending =
    joinMutation.isPending ||
    cancelMutation.isPending ||
    deleteMutation.isPending;

  if (isError) {
    console.error(error);
    return <div>{String(error)}</div>;
  }

  return (
    <>
      <div className="p-6 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
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
            <div className="w-full h-px bg-outline" />

            {/* 소개 */}
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <p>트랙 소개</p>
                <p className="text-text-3 break-keep">
                  {trackData?.data.descripton}
                </p>
              </div>

              {/* 작성자 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                  {trackData?.data.createrNickname?.slice(0, 1)}
                </div>
                <div className="flex flex-col">
                  <span>{trackData?.data.createrNickname}</span>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="w-full h-px bg-outline" />

            {/* 생성일 */}
            <span className="text-text-3 text-sm">
              생성일: {trackData?.data.createdAt?.slice(0, 10)}
            </span>
          </div>
        </div>
        {/* 버튼 */}
        <div className="pt-4">
          <div className="w-full">
            {memberType === "CREATOR" ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (storytrackId) {
                      router.push(`/dashboard/storyTrack/${storytrackId}/edit`);
                    }
                  }}
                  className="cursor-pointer justify-center bg-text-2 hover:bg-text-3 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Pencil />
                  수정
                </button>
                <button
                  className="cursor-pointer justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 disabled:opacity-60"
                  disabled={isPending || !storytrackId}
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 />
                  {deleteMutation.isPending ? "삭제 중..." : "삭제"}
                </button>
              </div>
            ) : memberType === "NOT_JOINED" ? (
              <button
                className="w-full flex items-center justify-center gap-2 cursor-pointer bg-primary hover:bg-primary-3 text-white px-4 py-3 rounded-xl disabled:opacity-60"
                disabled={isPending}
                onClick={() => joinMutation.mutate()}
              >
                <Play />
                <span>{isPending ? "처리중..." : "참여하기"}</span>
              </button>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-2 cursor-pointer bg-primary hover:bg-primary-3 text-white px-4 py-3 rounded-xl disabled:opacity-60"
                disabled={isPending}
                onClick={() => setIsCancelConfirmOpen(true)}
              >
                <X />
                <span>{isPending ? "처리중..." : "참여 취소"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* 참여취소 확인 모달 */}
      {isCancelConfirmOpen && (
        <ConfirmModal
          active="fail"
          title="참여 취소"
          content="참여를 취소하시겠습니까?"
          open={isCancelConfirmOpen}
          onClose={() => setIsCancelConfirmOpen(false)}
          onConfirm={() => {
            setIsCancelConfirmOpen(false);
            cancelMutation.mutate();
          }}
        />
      )}

      {/* 삭제 모달 */}
      <ConfirmModal
        active="fail"
        title="스토리트랙 삭제"
        content={"스토리트랙을 삭제할까요?\n삭제하면 되돌릴 수 없어요."}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          setIsDeleteOpen(false);
          deleteMutation.mutate();
        }}
      />
    </>
  );
}
