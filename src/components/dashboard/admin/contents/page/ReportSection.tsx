"use client";

import { adminReportApi } from "@/lib/api/admin/reports/adminReports";
import AdminHeader from "../AdminHeader";
import AdminBody from "../body/AdminBody";
import StatsOverview from "../StatsOverview";
import { useQuery } from "@tanstack/react-query";

const REPORT_TABS = [
  { key: "all", label: "전체" },
  { key: "accepted", label: "승인" },
  { key: "rejected", label: "반려" },
  { key: "pending", label: "대기" },
  { key: "reviewing", label: "검토중" },
] as const;

export default function ReportSection() {
  const base = { query: "", page: 0, size: 1 as const };

  const qAll = useQuery({
    queryKey: ["adminUsersCount", "all"],
    queryFn: ({ signal }) =>
      adminReportApi.list({ tab: "all", ...base, signal }),
    staleTime: 30_000,
  });

  const qAccepted = useQuery({
    queryKey: ["adminUsersCount", "accepted"],
    queryFn: ({ signal }) =>
      adminReportApi.list({ tab: "accepted", ...base, signal }),
    staleTime: 30_000,
  });

  const qRejected = useQuery({
    queryKey: ["adminUsersCount", "rejected"],
    queryFn: ({ signal }) =>
      adminReportApi.list({ tab: "rejected", ...base, signal }),
    staleTime: 30_000,
  });

  const qPending = useQuery({
    queryKey: ["adminUsersCount", "pending"],
    queryFn: ({ signal }) =>
      adminReportApi.list({ tab: "pending", ...base, signal }),
    staleTime: 30_000,
  });

  const counts = {
    total: qAll.data?.totalElements ?? 0,
    accepted: qAccepted.data?.totalElements ?? 0,
    rejected: qRejected.data?.totalElements ?? 0,
    pending: qPending.data?.totalElements ?? 0,
  };

  return (
    <>
      <div className="w-full space-y-8">
        <AdminHeader
          title="신고 관리"
          content="신고된 사용자와 편지을 관리할 수 있습니다"
        />

        <StatsOverview
          tabs={REPORT_TABS}
          totals={counts.total ?? 0}
          second={counts.accepted ?? 0}
          third={counts.rejected ?? 0}
          fourth={counts.pending ?? 0}
        />

        <AdminBody
          section="reports"
          tabs={REPORT_TABS}
          defaultTab="all"
          searchPlaceholder="신고자 이름 또는 편지 아이디로 검색..."
        />
      </div>
    </>
  );
}
