"use client";

import { X } from "lucide-react";

export default function ReportDetailHeader({
  reportId,
  onClose,
}: {
  reportId: number | null;
  onClose: () => void;
}) {
  return (
    <div className="py-3 px-4 md:py-4 md:px-6 flex justify-between items-center border-b border-outline shrink-0">
      <div className="flex-1 min-w-0">
        <h4 className="text-base md:text-lg truncate">신고 상세 정보</h4>
        <span className="text-[11px] md:text-xs text-text-3">
          신고 ID: #{reportId ?? "-"}
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="cursor-pointer p-2 -mr-2 rounded-lg hover:bg-sub"
        aria-label="close"
      >
        <X />
      </button>
    </div>
  );
}
