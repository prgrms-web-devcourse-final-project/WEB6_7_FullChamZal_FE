"use client";

import { useEffect, useMemo, useState } from "react";
import { ListOrdered, MapPin, Shuffle, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";

export default function TrackCard({ track }: { track: StoryTrackItem }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [overlayOpen, setOverlayOpen] = useState(false);

  const [memberType, setMemberType] = useState<MemberType>(
    track.memberType ?? "NOT_JOIN"
  );

  // 터치 디바이스 판별 (모바일/태블릿 등)
  const isTouch = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || (navigator?.maxTouchPoints ?? 0) > 0;
  }, []);

  useEffect(() => {
    if (!overlayOpen) return;

    const close = () => setOverlayOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [overlayOpen]);

  const goDetail = () =>
    router.push(`/dashboard/storyTrack/${track.storytrackId}`);

  const handleCardClick = () => {
    // 모바일 UX: 첫 탭은 오버레이만, 두 번째 탭은 상세 이동
    if (isTouch) {
      if (!overlayOpen) {
        setOverlayOpen(true);
        return;
      }
      setOverlayOpen(false);
      return;
    }
  };

  // 참여하기
  const joinMutation = useMutation({
    mutationFn: () =>
      storyTrackApi.participantStorytrack({ storytrackId: track.storytrackId }),
    onMutate: async () => {
      // 낙관적 업데이트: 참여중으로
      setMemberType("PARTICIPANT");
    },
    onError: () => {
      // 실패 롤백: 원래 상태로 되돌림 (대부분 NOT_JOIN)
      setMemberType((track.memberType as MemberType) ?? "NOT_JOIN");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allStoryTrack"] });
      await queryClient.invalidateQueries({ queryKey: ["joinedStoryTrack"] });
    },
  });

  /* 참여취소 */
  const cancelMutation = useMutation({
    mutationFn: () =>
      storyTrackApi.deleteParticipantStorytrack({
        storytrackId: track.storytrackId,
      }),
    onMutate: async () => {
      // 낙관적 업데이트: 미참여로
      setMemberType("NOT_JOIN");
    },
    onError: () => {
      setMemberType((track.memberType as MemberType) ?? "PARTICIPANT");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allStoryTrack"] });
      await queryClient.invalidateQueries({ queryKey: ["joinedStoryTrack"] });
    },
  });

  const isPending = joinMutation.isPending || cancelMutation.isPending;

  // 상태별 버튼 텍스트/스타일/동작
  const joinButton = (() => {
    if (memberType === "CREATOR") {
      return {
        show: false,
        label: "내가 만든 트랙",
        disabled: true,
        className: "bg-white text-black",
        onClick: undefined as undefined | (() => void),
      };
    }

    if (memberType === "COMPLETED") {
      return {
        show: true,
        label: "완료",
        disabled: true,
        className: "bg-white text-black",
        onClick: undefined,
      };
    }

    if (memberType === "PARTICIPANT") {
      return {
        show: true,
        label: isPending ? "처리 중..." : "참여취소",
        disabled: isPending,
        className: "bg-white text-black",
        onClick: () => cancelMutation.mutate(),
      };
    }

    // NOT_JOIN
    return {
      show: true,
      label: isPending ? "처리 중..." : "참여하기",
      disabled: isPending,
      className: "bg-primary text-white",
      onClick: () => joinMutation.mutate(),
    };
  })();

  return (
    <div
      className="relative border border-outline rounded-xl overflow-hidden group"
      onClick={handleCardClick}
    >
      {/* 이미지 */}
      <Image
        src="https://cdn.pixabay.com/photo/2024/01/15/21/13/puppy-8510899_1280.jpg"
        alt={track.title}
        width={800}
        height={200}
        className="w-full h-40 object-cover"
      />

      {/* Hover(데스크톱) + State(모바일 첫 탭) Overlay */}
      <div
        className={[
          "absolute inset-0 z-10 bg-black/60",
          "flex items-center justify-center gap-3",
          "transition-opacity duration-200",
          "opacity-0 pointer-events-none",
          "group-hover:opacity-100 group-hover:pointer-events-auto",
          overlayOpen ? "opacity-100 pointer-events-auto" : "",
        ].join(" ")}
        onClick={(e) => {
          e.stopPropagation();
          if (isTouch) setOverlayOpen(false);
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOverlayOpen(false);
            goDetail();
          }}
          className="cursor-pointer px-4 py-2 rounded-xl bg-white text-black text-sm font-medium"
        >
          자세히 보기
        </button>

        {/* 참여 관련 버튼: 상태별 분기 */}
        {joinButton.show && (
          <button
            type="button"
            disabled={joinButton.disabled}
            onClick={(e) => {
              e.stopPropagation();
              setOverlayOpen(false);
              joinButton.onClick?.();
            }}
            className={[
              "cursor-pointer px-4 py-2 rounded-xl text-sm font-medium",
              joinButton.className,
              joinButton.disabled ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {joinButton.label}
          </button>
        )}
      </div>

      {/* Bottom */}
      <div className="p-6 gap-4 flex flex-col items-start">
        {/* 제목 / 소개 */}
        <div className="gap-1 flex flex-col items-start">
          <p className="font-medium">{track.title}</p>
          <p className="text-sm text-text-3 line-clamp-2 break-keep">
            {track.desctiption}
          </p>
        </div>

        {/* 작성자 */}
        <div className="flex items-center gap-1.5">
          <div className="flex-none w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">
            {track.createrName?.[0] ?? "?"}
          </div>
          <p className="text-xs text-text-2">{track.createrName}</p>
        </div>

        {/* 아이콘 요약 */}
        <div className="text-text-3 text-xs flex items-center gap-3">
          <div className="flex gap-1 items-center">
            {track.trackType === "FREE" ? (
              <>
                <Shuffle size={16} />
                순서 무관
              </>
            ) : (
              <>
                <ListOrdered size={16} />
                순서대로
              </>
            )}
          </div>
          <div className="flex gap-1 items-center">
            <MapPin size={16} />
            {track.totalSteps}개 장소
          </div>
          <div className="flex gap-1 items-center">
            <Users size={16} />
            {track.totalMemberCount ?? 0}명
          </div>
        </div>
      </div>
    </div>
  );
}
