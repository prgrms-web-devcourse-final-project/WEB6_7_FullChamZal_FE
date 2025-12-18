"use client";

import { CheckCircle, Clock5, XCircle, HelpCircle } from "lucide-react";

export const REPORT_STATUS_UI: Record<
  ReportStatus,
  {
    label: string;
    badgeClass: string;
    icon: React.ReactNode;
    cardClass: string;
  }
> = {
  PENDING: {
    label: "대기",
    badgeClass: "bg-orange-100 text-orange-800",
    icon: <Clock5 size={14} />,
    cardClass: "border-outline",
  },
  REVIEWING: {
    label: "검토중",
    badgeClass: "bg-blue-100 text-blue-800",
    icon: <Clock5 size={14} />,
    cardClass: "border-blue-200",
  },
  ACCEPTED: {
    label: "승인",
    badgeClass: "bg-green-100 text-green-800",
    icon: <CheckCircle size={14} />,
    cardClass: "border-green-200",
  },
  REJECTED: {
    label: "반려",
    badgeClass: "bg-red-100 text-red-800",
    icon: <XCircle size={14} />,
    cardClass: "border-red-200",
  },
};

export default function ReportStatusBadge({
  status,
}: {
  status: ReportStatus;
}) {
  const ui = REPORT_STATUS_UI[status];

  if (!ui) {
    return (
      <span className="inline-flex items-center gap-1 py-1 px-3 rounded-md text-xs bg-gray-100 text-gray-600">
        <HelpCircle size={14} />알 수 없음
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 py-1 px-3 rounded-md text-xs ${ui.badgeClass}`}
    >
      {ui.icon}
      {ui.label}
    </span>
  );
}
