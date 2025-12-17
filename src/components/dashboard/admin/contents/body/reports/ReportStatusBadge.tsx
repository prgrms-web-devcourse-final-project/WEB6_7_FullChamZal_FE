"use client";

import { CheckCircle, Clock5, XCircle } from "lucide-react";

export const REPORT_STATUS_UI = {
  PENDING: {
    label: "대기",
    badgeClass: "bg-orange-100 text-orange-800",
    icon: <Clock5 size={14} />,
    cardClass: "border-outline",
  },
  APPROVED: {
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
} as const;

export default function ReportStatusBadge({
  status,
}: {
  status: AdminReport["status"];
}) {
  const ui = REPORT_STATUS_UI[status];

  return (
    <span
      className={`inline-flex items-center gap-1 py-1 px-3 rounded-md text-xs ${ui.badgeClass}`}
    >
      {ui.icon}
      {ui.label}
    </span>
  );
}
