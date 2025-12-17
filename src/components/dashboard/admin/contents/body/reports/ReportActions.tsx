"use client";

import { CheckCircle, Eye, XCircle } from "lucide-react";

export default function ReportActions({
  report,
  onApprove,
  onReject,
  onOpenDetail,
}: {
  report: AdminReport;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onOpenDetail: (id: number) => void;
}) {
  if (report.status === "PENDING") {
    return (
      <div className="border-t border-outline flex gap-2 pt-4">
        <button
          onClick={() => onApprove(report.id)}
          className="cursor-pointer py-2 px-3 flex items-center gap-1 rounded-lg bg-green-100 hover:bg-green-200"
        >
          <CheckCircle size={16} />
          <span>승인</span>
        </button>

        <button
          onClick={() => onReject(report.id)}
          className="cursor-pointer py-2 px-3 flex items-center gap-1 rounded-lg bg-red-100 hover:bg-red-200"
        >
          <XCircle size={16} />
          <span>반려</span>
        </button>

        <button
          onClick={() => onOpenDetail(report.id)}
          className="cursor-pointer py-2 px-3 flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          <Eye size={16} />
          <span>상세보기</span>
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-outline flex gap-2 pt-4">
      <button
        onClick={() => onOpenDetail(report.id)}
        className="cursor-pointer py-2 px-3 flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        <Eye size={16} />
        <span>상세보기</span>
      </button>

      <span className="text-xs text-text-2 flex items-center">처리 완료</span>
    </div>
  );
}
