"use client";

import { formatDate } from "@/lib/formatDate";
import ReportActions from "./ReportActions";
import ReportStatusBadge, { REPORT_STATUS_UI } from "./ReportStatusBadge";

export default function ReportCard({
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

        <p className="text-text-2 text-sm w-full rounded-lg bg-sub border border-outline p-3">
          욕설이 포함된 편지를 보냈습니다.
        </p>
      </div>

      <ReportActions
        report={report}
        onApprove={onApprove}
        onReject={onReject}
        onOpenDetail={onOpenDetail}
      />
    </div>
  );
}
