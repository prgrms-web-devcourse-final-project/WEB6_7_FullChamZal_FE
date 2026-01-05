"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ListOrdered, MapPin, Shuffle, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storyTrackApi } from "@/lib/api/dashboard/storyTrack";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function TrackCard({ track }: { track: StoryTrackItem }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  // 참여취소 확인 모달 상태 추가
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const [memberType, setMemberType] = useState<MemberType>(
    track.memberType ?? "NOT_JOINED"
  );

  const isTouch = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || (navigator?.maxTouchPoints ?? 0) > 0;
  }, []);

  // 카드 밖 탭하면 닫기
  useEffect(() => {
    if (!isTouch || !overlayOpen) return;

    const onDown = (e: PointerEvent) => {
      const el = cardRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOverlayOpen(false);
    };

    document.addEventListener("pointerdown", onDown, { capture: true });
    return () => {
      document.removeEventListener("pointerdown", onDown, {
        capture: true,
      });
    };
  }, [isTouch, overlayOpen]);

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
    if (isTouch) {
      setOverlayOpen(true);
      return;
    }
    goDetail();
  };

  // 참여하기
  const joinMutation = useMutation({
    mutationFn: () =>
      storyTrackApi.participantStorytrack({ storytrackId: track.storytrackId }),
    onMutate: async () => setMemberType("PARTICIPANT"),
    onError: () => {
      setMemberType((track.memberType as MemberType) ?? "NOT_JOINED");
      toast.error("참여하기를 실패했습니다.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allStoryTrack"] });
      await queryClient.invalidateQueries({ queryKey: ["joinedStoryTrack"] });
      toast.success("참여하기가 완료되었습니다!", {
        style: { borderColor: "#57b970" },
      });
    },
  });

  // 참여취소
  const cancelMutation = useMutation({
    mutationFn: () =>
      storyTrackApi.deleteParticipantStorytrack({
        storytrackId: track.storytrackId,
      }),
    onMutate: async () => setMemberType("NOT_JOINED"),
    onError: () => {
      setMemberType((track.memberType as MemberType) ?? "PARTICIPANT");
      toast.error("참여취소를 실패했습니다.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allStoryTrack"] });
      await queryClient.invalidateQueries({ queryKey: ["joinedStoryTrack"] });
      toast.success("참여취소가 완료되었습니다.", {
        style: { borderColor: "#57b970" },
      });
    },
  });

  const isPending = joinMutation.isPending || cancelMutation.isPending;

  const joinButton = (() => {
    if (memberType === "CREATOR") {
      return {
        show: false,
        label: "",
        disabled: true,
        className: "",
        onClick: undefined,
      };
    }
    if (memberType === "COMPLETED") {
      return {
        show: true,
        label: "완료",
        disabled: true,
        className: "bg-text text-bg",
        onClick: undefined,
      };
    }
    if (memberType === "PARTICIPANT") {
      return {
        show: true,
        label: isPending ? "처리 중..." : "참여취소",
        disabled: isPending,
        className: "bg-text text-bg",
        onClick: () => setIsCancelConfirmOpen(true),
      };
    }
    return {
      show: true,
      label: isPending ? "처리 중..." : "참여하기",
      disabled: isPending,
      className: "bg-primary text-text",
      onClick: () => {
        joinMutation.mutate();
      },
    };
  })();

  const overlayClassMobile = overlayOpen
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";

  return (
    <>
      {/* 참여취소 ConfirmModal (PARTICIPANT일 때만 열리게 흐름상 보장됨) */}
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

      <div
        ref={cardRef}
        className="relative isolate border border-outline rounded-xl overflow-hidden group"
        onClick={handleCardClick}
      >
        <Image
          src="https://cdn.pixabay.com/photo/2024/01/15/21/13/puppy-8510899_1280.jpg"
          alt={track.title}
          width={800}
          height={200}
          className="w-full h-40 object-cover"
          draggable={false}
        />

        <div
          className={`absolute inset-0 z-30 bg-text/60 flex items-center justify-center gap-3 transition-opacity duration-200 md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:transition-opacity md:duration-200 md:flex md:items-center md:justify-center
          ${overlayClassMobile}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="cursor-pointer px-4 py-2 rounded-xl bg-bg text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              setOverlayOpen(false);
              goDetail();
            }}
          >
            자세히 보기
          </button>

          {joinButton.show && (
            <button
              type="button"
              disabled={joinButton.disabled}
              className={[
                "cursor-pointer px-4 py-2 rounded-xl text-sm font-medium",
                joinButton.className,
                joinButton.disabled ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
              onClick={(e) => {
                e.stopPropagation();
                setOverlayOpen(false);
                joinButton.onClick?.();
              }}
            >
              {joinButton.label}
            </button>
          )}
        </div>

        {/* Bottom */}
        <div className="p-6 gap-4 flex flex-col items-start">
          <div className="gap-1 flex flex-col items-start">
            <p className="font-medium">{track.title}</p>
            <p className="text-sm text-text-3 line-clamp-2 break-keep">
              {track.desctiption}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex-none w-6 h-6 rounded-full bg-text text-bg text-xs flex items-center justify-center">
              {track.createrName?.[0] ?? "?"}
            </div>
            <p className="text-xs text-text-2">{track.createrName}</p>
          </div>

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
    </>
  );
}
