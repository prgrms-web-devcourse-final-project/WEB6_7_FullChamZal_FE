"use client";

import { Eye } from "lucide-react";

export default function ReportActions({
  report,
  onOpenDetail,
}: {
  report: AdminReport;
  onOpenDetail: (id: number) => void;
}) {
  return (
    <div className="border-t border-outline flex gap-2 pt-4 text-sm">
      <button
        onClick={() => onOpenDetail(report.id)}
        className="cursor-pointer py-2 px-3 flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-outline"
      >
        <Eye size={16} />
        <span>상세보기</span>
      </button>
    </div>
  );
}
