"use client";

export default function ReportDetailFooter({
  disabled,
  isMutating,
  onApprove,
  onReject,
}: {
  disabled: boolean;
  isMutating: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="py-3 px-4 md:py-4 md:px-6 border-t border-outline shrink-0">
      <div className="flex flex-col md:flex-row gap-2 md:gap-3">
        <button
          className="cursor-pointer w-full md:flex-1 rounded-xl bg-admin p-2 text-white hover:bg-admin/80 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-admin"
          disabled={disabled}
          onClick={onApprove}
        >
          {isMutating ? "처리 중…" : "신고 승인"}
        </button>

        <button
          className="cursor-pointer w-full md:flex-1 rounded-xl p-2 hover:bg-button-hover border border-outline disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          disabled={disabled}
          onClick={onReject}
        >
          {isMutating ? "처리 중…" : "신고 반려"}
        </button>
      </div>
    </div>
  );
}
