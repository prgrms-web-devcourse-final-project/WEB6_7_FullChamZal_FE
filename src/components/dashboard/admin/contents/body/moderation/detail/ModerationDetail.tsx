/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import Modal from "@/components/common/Modal";
import { AdminModerationApi } from "@/lib/api/admin/moderation/adminModeration";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import ModerationDetailHeader from "./ModerationDetailHeader";
import ModerationBasicInfo from "./ModerationBasicInfo";
import ModerationSummary from "./ModerationSummary";
import ModerationRawJson from "./ModerationRawJson";

type Props = {
  open: boolean;
  id: number | null;
  onClose: () => void;
};

export default function ModerationDetail({ open, id, onClose }: Props) {
  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const {
    data: detail,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminModerationDetail", id],
    enabled: open && !!id,
    queryFn: ({ signal }) =>
      AdminModerationApi.get({ id: id as number, signal }),
  });

  const raw = useMemo<ModerationRaw | null>(() => {
    if (!detail?.rawResponseJson) return null;
    try {
      return JSON.parse(detail.rawResponseJson);
    } catch {
      return null;
    }
  }, [detail?.rawResponseJson]);

  console.log(raw);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative z-10 w-[min(920px,94vw)] md:w-[min(920px,92vw)] max-h-[88dvh] md:max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
        <ModerationDetailHeader
          id={detail?.id}
          onClose={onClose}
          title="검증 로그 상세"
        />

        <div className="flex-1 min-h-0 px-4 md:px-5 py-4 space-y-4 overflow-y-auto">
          {isLoading && (
            <div className="text-sm text-gray-600">불러오는 중…</div>
          )}

          {isError && (
            <div className="text-sm text-red-600">
              불러오기 실패: {String(error?.message ?? "")}
            </div>
          )}

          {!isLoading && !isError && detail && (
            <>
              <ModerationBasicInfo detail={detail} />
              <ModerationSummary raw={raw} />
              <ModerationRawJson rawResponseJson={detail.rawResponseJson} />
            </>
          )}

          {!isLoading && !isError && !detail && (
            <div className="text-sm text-gray-600">데이터가 없습니다.</div>
          )}
        </div>
      </div>
    </Modal>
  );
}
