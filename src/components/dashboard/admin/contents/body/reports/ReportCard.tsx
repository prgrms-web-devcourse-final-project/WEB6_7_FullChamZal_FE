"use client";

import { formatDate } from "@/lib/hooks/formatDate";
import ReportActions from "./ReportActions";
import ReportStatusBadge, { REPORT_STATUS_UI } from "./ReportStatusBadge";

export default function ReportCard({
  report,
  onOpenDetail,
}: {
  report: AdminReport;
  onOpenDetail: (id: number) => void;
}) {
  const statusUi = REPORT_STATUS_UI[report.status];

  return (
    <div className={`border rounded-xl p-6 space-y-4 ${statusUi.cardClass}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-lg">
            {report.targetType === "LETTER" ? "편지" : "사용자"} 신고
          </span>

          <div className="text-xs flex items-center gap-2">
            <ReportStatusBadge status={report.status} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-x-1">
            <span className="text-text-2">신고자:</span>
            <span>{report.reporterNickname ?? "익명"}</span>
          </div>

          <div className="space-x-1">
            <span className="text-text-2">신고 일시:</span>
            <span>{formatDate(report.createdAt)}</span>
          </div>

          <div className="space-x-1">
            <span className="text-text-2">신고 내용:</span>
            <span>{report.reasonType}</span>
          </div>

          <div className="space-x-1">
            <span className="text-text-2">대상 ID:</span>
            <span>{report.targetId}</span>
          </div>
        </div>
      </div>

      <ReportActions report={report} onOpenDetail={onOpenDetail} />
    </div>
  );
}
